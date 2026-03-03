import express from 'express';
import { env } from './config/env.js';
import { initDatabase } from './services/dbInitService.js';
// Importaremos la conexión de Mongo más adelante cuando hagamos ese archivo
import { connectMongo } from './config/mongo.js'; 
import { migrateCsvToPostgres } from './services/migrateService.js';

const app = express();

// Middlewares básicos para entender JSON
app.use(express.json());

/**
 * FUNCIÓN DE ARRANQUE
 * Usamos una función async para asegurar que las tablas se creen
 * ANTES de que el servidor empiece a escuchar peticiones.
 */
async function startServer() {
    try {
        console.log("🚀 Arrancando sistema...");

        // 1. Inicializamos las tablas de PostgreSQL
        await initDatabase();

        // 2. Aquí conectaríamos con MongoDB
        await connectMongo();

        // 2. Aquí metemos la mercancia (CSV)
        await migrateCsvToPostgres();

        // 3. Iniciamos el servidor Express
        app.listen(env.port, () => {
            console.log(`\x1b[36m%s\x1b[0m`, `⭐ Servidor listo en: http://localhost:${env.port}`);
        });

    } catch (error) {
        console.error("❌ No se pudo arrancar el servidor:", error);
        process.exit(1);
    }
}

// ¡Llamamos a la función de arranque!
startServer();

export default app;