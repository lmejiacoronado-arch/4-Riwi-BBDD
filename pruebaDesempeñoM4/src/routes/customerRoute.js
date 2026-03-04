import { Router } from 'express';
import { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../controller/customerController.js';

const router = Router();

// Endpoint: GET http://localhost:PORT/api/customers
router.get('/customers', getAllCustomers);

// Endpoint: GET http://localhost:PORT/api/customers/:id
router.get('/customers/:id', getCustomerById);

// Nueva Ruta: Creación (Create)
router.post('/customers', createCustomer);

// Nueva Ruta: Actualización (Update)
router.put('/customers/:id', updateCustomer);

// Nueva Ruta: Eliminación (Delete)
router.delete('/customers/:id', deleteCustomer);

export default router;