import express from 'express';
import { env } from './config/env.js';
import { initDatabase } from './services/dbInitService.js';
import { connectMongo } from './config/mongo.js'; 
import { migrateCsvToPostgres } from './services/migrateService.js';
import { dropAllTables } from './services/cleanDbService.js';

// 1. IMPORTACIÓN DE RUTAS
// Importamos el archivo que creamos con GET, POST, PUT y DELETE
import migrationRoute from './routes/migrationRoute.js';
import customerRoute from './routes/customerRoute.js'; 

const app = express();

/**
 * MIDDLEWARES
 * express.json() es FUNDAMENTAL ahora. Sin esto, req.body llegará vacío
 * en tus peticiones POST y PUT de Postman.
 */
app.use(express.json());

// 2. REGISTRO DE ESCENARIOS (RUTAS)
// Todo lo que pase por estas rutas tendrá el prefijo /api
app.use('/api', migrationRoute);
app.use('/api', customerRoute);

/**
 * FUNCIÓN DE ARRANQUE (FLUJO PRINCIPAL)
 * Mantenemos la lógica de preparar la casa antes de recibir invitados.
 */
async function startServer() {
    try {
        console.log("🚀 [Sistema]: Iniciando procesos de arranque...");
        
        // Paso A: Limpieza total (Idempotencia de estructura)
        await dropAllTables();

        // Paso B: Creación de tablas según el modelo relacional
        await initDatabase();

        // Paso C: Conexión a la base de datos NoSQL (Logs)
        await connectMongo();

        // Paso D: Ingesta del archivo CSV desorganizado
        await migrateCsvToPostgres();

        // Paso E: El servidor se pone a escuchar
        app.listen(env.port, () => {
            console.log(`\n⭐ ========================================== ⭐`);
            console.log(`✅ Servidor activo en: http://localhost:${env.port}`);
            console.log(`📂 Rutas de Clientes: http://localhost:${env.port}/api/customers`);
            console.log(`⭐ ========================================== ⭐\n`);
        });

    } catch (error) {
        console.error("❌ [Error Crítico]: El servidor no pudo iniciar:", error);
        process.exit(1);
    }
}

// ¡Damos la señal de inicio!
startServer();

export default app;