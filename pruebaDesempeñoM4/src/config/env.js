import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

/**
 * 1. CONFIGURACIÓN DE RUTAS MANUALES
 * En módulos de Node (ESM), no existe __dirname por defecto. 
 * Estas dos líneas emulan ese comportamiento para que el código sepa 
 * exactamente dónde está parado, sin importar desde dónde ejecutes el comando.
 */
const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

/**
 * 2. CARGA DEL ARCHIVO .ENV
 * 'resolve' construye la ruta absoluta: sube dos niveles desde 'src/config' 
 * hasta la raíz del proyecto para encontrar el archivo .env.
 */
config({ path: resolve(_dirname, '../../.env') });

/**
 * 3. LISTA DE VARIABLES CRÍTICAS
 * Definimos qué variables son obligatorias. Si falta alguna, el proyecto
 * no podrá conectarse a Docker y fallará más adelante.
 */
const requiredVars = ["MONGO_URI", "POSTGRES_URI"];

/**
 * 4. VALIDACIÓN "FAIL-FAST" (Fallar rápido)
 * Es mejor que la aplicación se detenga AQUÍ con un mensaje claro,
 * a que intente arrancar y dé un error de "undefined" difícil de entender.
 */
for (const key of requiredVars) {
    if (!process.env[key]) {
        console.error(`\x1b[31m%s\x1b[0m`, `❌ ERROR CRÍTICO: La variable ${key} no está definida en el .env`);
        console.error(`Asegúrate de configurar tus contenedores de Docker correctamente.`);
        process.exit(1); // Detiene la ejecución con código de error
    }
}

/**
 * 5. OBJETO DE CONFIGURACIÓN EXPORTABLE
 * Centralizamos todas las variables en un solo objeto.
 * Esto facilita el mantenimiento: si cambias un nombre en el .env, 
 * solo lo editas aquí y no en los 20 archivos de tu proyecto.
 */
export const env = {
    // Puerto del servidor (Usa 3000 por defecto si no hay nada en el .env)
    port: process.env.PORT ?? 3000,

    // URIs de conexión para las bases de datos en Docker
    postgresUri: process.env.POSTGRES_URI,
    mongoUri: process.env.MONGO_URI,

    // Ruta del archivo CSV de datos
    // Usamos el operador ?? para poner un valor por defecto si la variable no existe
    fileDataCsv: process.env.FILE_DATA_CSV ?? "./data/AM-prueba-desempeno-data_m4.csv"
};

console.log(`\x1b[32m%s\x1b[0m`, `✅ Configuración del entorno cargada exitosamente.`);