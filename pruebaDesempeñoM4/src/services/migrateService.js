import fs from 'fs';
import csv from 'csv-parser';
import { pool } from '../config/postgres.js';
import { env } from '../config/env.js';

/**
 * SERVICIO DE MIGRACIÓN: CSV -> POSTGRESQL
 * Este servicio extrae los datos del CSV y los carga en el orden jerárquico correcto.
 */
export const migrateCsvToPostgres = async () => {
    const results = [];

    // 1. Lectura del archivo mediante Streams
    fs.createReadStream(env.fileDataCsv)
        .pipe(csv()) 
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            console.log(`📂 CSV cargado: ${results.length} filas detectadas. Iniciando migración...`);

            for (const row of results) {
                // Obtenemos una conexión del Pool
                const client = await pool.connect();
                try {
                    // Iniciamos transacción para asegurar que la fila se cargue completa o nada
                    await client.query('BEGIN');

                    // --- PASO 1: CLIENTE ---
                    const customerRes = await client.query(`
                        INSERT INTO customer (customer_name, customer_email, customer_address, customer_phone)
                        VALUES ($1, $2, $3, $4)
                        ON CONFLICT (customer_email) DO UPDATE SET customer_name = EXCLUDED.customer_name
                        RETURNING id_customer
                    `, [row.customer_name, row.customer_email, row.customer_address, row.customer_phone]);
                    const customerId = customerRes.rows[0].id_customer;

                    // --- PASO 2: CATEGORÍA ---
                    const categoryRes = await client.query(`
                        INSERT INTO category (product_category)
                        VALUES ($1)
                        ON CONFLICT (product_category) DO UPDATE SET product_category = EXCLUDED.product_category
                        RETURNING id_category
                    `, [row.product_category]);
                    const categoryId = categoryRes.rows[0].id_category;

                    // --- PASO 3: PROVEEDOR ---
                    const supplierRes = await client.query(`
                        INSERT INTO supplier (supplier_name, supplier_email)
                        VALUES ($1, $2)
                        ON CONFLICT (supplier_email) DO UPDATE SET supplier_name = EXCLUDED.supplier_name
                        RETURNING id_supplier
                    `, [row.supplier_name, row.supplier_email]);
                    const supplierId = supplierRes.rows[0].id_supplier;

                    // --- PASO 4: PRODUCTO ---
                    // IMPORTANTE: parseFloat para asegurar que unit_price sea numérico
                    const productRes = await client.query(`
                        INSERT INTO product (product_sku, product_name, unit_price, id_category, id_supplier)
                        VALUES ($1, $2, $3, $4, $5)
                        ON CONFLICT (product_sku) DO UPDATE SET product_name = EXCLUDED.product_name
                        RETURNING id_product
                    `, [row.product_sku, row.product_name, parseFloat(row.unit_price), categoryId, supplierId]);
                    const productId = productRes.rows[0].id_product;

                    // --- PASO 5: TRANSACCIÓN (Cabecera) ---
                    // transaction_id es VARCHAR, por lo que acepta el formato del CSV
                    await client.query(`
                        INSERT INTO "transaction" (transaction_id, fecha, id_customer)
                        VALUES ($1, $2, $3)
                        ON CONFLICT (transaction_id) DO NOTHING
                    `, [row.transaction_id, row.date, customerId]); 

                    // --- PASO 6: DETALLE DE TRANSACCIÓN ---
                    // total_line_value es el nombre de tu columna en el CSV
                    await client.query(`
                        INSERT INTO "transaction_details" (quantity, total, transaction_id, id_product)
                        VALUES ($1, $2, $3, $4)
                    `, [
                        parseInt(row.quantity), 
                        parseFloat(row.total_line_value), 
                        row.transaction_id, 
                        productId
                    ]);

                    // Si todo salió bien para esta fila, confirmamos
                    await client.query('COMMIT');
                } catch (error) {
                    // Si algo falla, revertimos los cambios de esta fila específica
                    await client.query('ROLLBACK');
                    console.error(`❌ Error en transacción ${row.transaction_id}:`, error.message);
                } finally {
                    // Devolvemos el cliente al pool
                    client.release();
                }
            }
            console.log("✅ Migración a PostgreSQL completada exitosamente.");
        });
};