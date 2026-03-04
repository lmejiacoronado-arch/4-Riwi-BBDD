import { pool } from '../config/postgres.js';


export const getAllCustomers = async (req, res) => {
    try {
        console.log("🟢 [Controlador]: Solicitando lista de clientes...");
        const result = await pool.query('SELECT * FROM customer ORDER BY customer_name ASC');
        
        // Enviamos la respuesta. Si esto se ejecuta, Postman deja de cargar.
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("❌ [Controlador Error]:", error.message);
        res.status(500).json({ error: "Error al obtener clientes" });
    }
};

export const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM customer WHERE id_customer = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * POST: CREAR UN NUEVO CLIENTE
 * Se relaciona con tu proyecto permitiendo añadir ciudadanos manualmente
 * más allá de los que venían en el CSV inicial.
 */
export const createCustomer = async (req, res) => {
    try {
        // Extraemos los datos que vienen en el cuerpo de la petición (Postman)
        const { customer_name, customer_email } = req.body;
        
        // Validación básica: No permitimos campos vacíos
        if (!customer_name || !customer_email) {
            return res.status(400).json({ message: "Nombre y email son obligatorios" });
        }

        // Insertamos y pedimos que nos devuelva el registro creado (RETURNING *)
        const query = 'INSERT INTO customer (customer_name, customer_email) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(query, [customer_name, customer_email]);
        
        res.status(201).json({
            message: "✅ Cliente creado con éxito",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("❌ Error al crear cliente:", error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * PUT: ACTUALIZAR UN CLIENTE
 * Permite corregir errores en los datos (como el nombre o el correo)
 * usando el ID como referencia única.
 */
export const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params; // ID de la URL
        const { customer_name, customer_email } = req.body; // Nuevos datos

        const query = 'UPDATE customer SET customer_name = $1, customer_email = $2 WHERE id_customer = $3 RETURNING *';
        const result = await pool.query(query, [customer_name, customer_email, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Cliente no encontrado para actualizar" });
        }

        res.status(200).json({
            message: "🔄 Cliente actualizado correctamente",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * DELETE: ELIMINAR UN CLIENTE
 * Importante: Si el cliente tiene compras asociadas, PostgreSQL
 * impedirá el borrado para mantener la integridad de los datos.
 */
export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query('DELETE FROM customer WHERE id_customer = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No se pudo eliminar: El cliente no existe" });
        }

        res.status(200).json({ message: "🗑️ Cliente eliminado de la base de datos" });
    } catch (error) {
        res.status(500).json({ 
            message: "No se puede eliminar: El cliente tiene transacciones vinculadas",
            error: error.message 
        });
    }
};