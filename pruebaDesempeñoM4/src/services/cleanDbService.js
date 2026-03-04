import { pool } from "../config/postgres.js";

/**
 * LIMPIEZA TOTAL DE LA BASE DE DATOS
 * Borra todas las tablas existentes respetando las jerarquías.
 */
export const dropAllTables = async () => {
    const client = await pool.connect();
    try {
        console.log("💣 Iniciando limpieza de base de datos...");
        await client.query('BEGIN');
        
        // El CASCADE es la clave: borra la tabla y todas sus relaciones (FK)
        await client.query(`
            DROP TABLE IF EXISTS transaction_details CASCADE;
            DROP TABLE IF EXISTS "transaction" CASCADE;
            DROP TABLE IF EXISTS product CASCADE;
            DROP TABLE IF EXISTS supplier CASCADE;
            DROP TABLE IF EXISTS category CASCADE;
            DROP TABLE IF EXISTS customer CASCADE;
        `);
        
        await client.query('COMMIT');
        console.log("🧹 Base de datos limpia (Tablas eliminadas).");
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("❌ Error al limpiar la base de datos:", error.message);
    } finally {
        client.release();
    }
};