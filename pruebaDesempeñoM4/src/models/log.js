import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    action: { type: String, required: true },    // 'CREATE', 'UPDATE', 'DELETE'
    entity: { type: String, required: true },    // 'customer', 'product', 'report'
    entity_id: { type: String },                 // ID del registro afectado
    user_data: { type: Object },                 // Los datos que se enviaron o borraron
    timestamp: { type: Date, default: Date.now } // Fecha automática
});

export const Log = mongoose.model('AuditLog', logSchema);