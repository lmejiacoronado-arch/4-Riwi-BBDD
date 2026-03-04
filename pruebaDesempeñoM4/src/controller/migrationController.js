import { dropAllTables } from '../services/cleanDbService.js';
import { initDatabase } from '../services/dbInitService.js';
import { migrateCsvToPostgres } from '../services/migrateService.js';

export const runMigration = async (req, res) => {
    try {
        console.log("📥 Petición de migración recibida...");
        
        // Ejecutamos el flujo completo
        await dropAllTables();
        await initDatabase();
        await migrateCsvToPostgres();

        res.status(200).json({
            message: "✅ Migración completada con éxito",
            status: "success",
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({
            message: "❌ Error durante la migración",
            error: error.message
        });
    }
};