import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * CONFIGURACIÓN DE MONGODB
 * Mongoose gestiona la conexión y nos permite usar Modelos más adelante.
 */
export const connectMongo = async () => {
    try {
        console.log("⏳ Conectando a MongoDB...");

        // Usamos la URI de env.js
        await mongoose.connect(env.mongoUri);

        console.log(`\x1b[32m%s\x1b[0m`, `✅ MongoDB: Conexión establecida exitosamente.`);

    } catch (error) {
        console.error(`\x1b[31m%s\x1b[0m`, `❌ MongoDB: Error de conexión`);
        console.error(`Detalle: ${error.message}`);
        // No cerramos el proceso aquí para dejar que Postgres al menos intente vivir,
        // pero podrías poner process.exit(1) si consideras que sin Mongo no hay app.
    }
};

// Escuchadores de eventos para monitorear la base de datos en tiempo real
mongoose.connection.on('error', (err) => {
    console.error(`🔴 MongoDB error interno: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.warn(`🟠 MongoDB: Se ha perdido la conexión.`);
});