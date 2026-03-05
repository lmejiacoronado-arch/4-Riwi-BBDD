// Importamos el pool de conexión a PostgreSQL
import { pool } from '../config/postgres.js';
// Importamos el modelo de MongoDB para la auditoría global
import { Log } from '../models/Log.js';

/**
 * GET: OBTENER TODOS LOS CLIENTES
 * Flujo: Consulta simple a Postgres para listar los ciudadanos.
 */
export const getAllCustomers = async (req, res) => {
    try {
        // Consultamos la tabla y ordenamos alfabéticamente
        const result = await pool.query('SELECT * FROM customer ORDER BY customer_name ASC');
        
        // Respondemos con la lista de clientes (Array)
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("❌ Error en GET Customers:", error.message);
        res.status(500).json({ error: "Error al obtener la lista de clientes" });
    }
};

/**
 * POST: CREAR CLIENTE + AUDITORÍA
 * Flujo: Inserta en Postgres -> Si tiene éxito, registra el evento en Mongo.
 */
export const createCustomer = async (req, res) => {
    try {
        // Desestructuramos los campos que llegan desde el Body de Postman
        const { customer_name, customer_email, customer_address, customer_phone } = req.body;
        
        // Validación: Nombre y Email son el mínimo requerido
        if (!customer_name || !customer_email) {
            return res.status(400).json({ message: "Nombre y email son campos obligatorios" });
        }

        // Query SQL con RETURNING * para obtener el ID generado automáticamente
        const query = `
            INSERT INTO customer (customer_name, customer_email, customer_address, customer_phone) 
            VALUES ($1, $2, $3, $4) RETURNING *`;
        
        const result = await pool.query(query, [customer_name, customer_email, customer_address, customer_phone]);
        const newCustomer = result.rows[0];

        // 📝 REGISTRO DE AUDITORÍA (MongoDB)
        // Guardamos quién entró al sistema para historial de seguridad
        await new Log({
            action: 'CREATE',
            entity: 'customer',
            entity_id: newCustomer.id_customer,
            user_data: newCustomer // Guardamos el objeto completo creado
        }).save();

        res.status(201).json({ 
            message: "✅ Cliente creado y auditado con éxito", 
            data: newCustomer 
        });

    } catch (error) {
        console.error("❌ Error en CREATE Customer:", error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * PUT: ACTUALIZAR CLIENTE + AUDITORÍA
 * Flujo: Actualiza datos en Postgres -> Registra el cambio en Mongo.
 */
export const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params; // ID que viene en la URL
        const { customer_name, customer_email, customer_address, customer_phone } = req.body;

        const query = `
            UPDATE customer 
            SET customer_name = $1, customer_email = $2, customer_address = $3, customer_phone = $4
            WHERE id_customer = $5 RETURNING *`;

        const result = await pool.query(query, [customer_name, customer_email, customer_address, customer_phone, id]);

        // Si result.rows está vacío, el ID no existía en la base de datos
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No se encontró el cliente para actualizar" });
        }

        // 📝 REGISTRO DE AUDITORÍA (MongoDB)
        // Registramos qué datos fueron modificados
        await new Log({
            action: 'UPDATE',
            entity: 'customer',
            entity_id: id,
            user_data: result.rows[0]
        }).save();

        res.status(200).json({ 
            message: "🔄 Cliente actualizado y auditoría registrada", 
            data: result.rows[0] 
        });

    } catch (error) {
        console.error("❌ Error en UPDATE Customer:", error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * DELETE: ELIMINAR CLIENTE + AUDITORÍA
 * Flujo: Borra de Postgres -> Guarda respaldo del dato borrado en Mongo.
 */
export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Ejecutamos el borrado. RETURNING * nos permite saber qué borramos para el log.
        const result = await pool.query('DELETE FROM customer WHERE id_customer = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "El cliente no existe en el sistema" });
        }

        // 📝 REGISTRO DE AUDITORÍA (MongoDB)
        // Es vital guardar los datos borrados por si se requiere una recuperación manual (Ciberseguridad)
        await new Log({
            action: 'DELETE',
            entity: 'customer',
            entity_id: id,
            user_data: result.rows[0]
        }).save();

        res.status(200).json({ 
            message: "🗑️ Cliente eliminado y evento registrado en auditoría" 
        });

    } catch (error) {
        // Manejo de errores de integridad referencial (si el cliente tiene compras asociadas)
        console.error("❌ Error en DELETE Customer:", error.message);
        res.status(500).json({ 
            message: "Error: No se puede eliminar un cliente con registros vinculados",
            error: error.message 
        });
    }
};