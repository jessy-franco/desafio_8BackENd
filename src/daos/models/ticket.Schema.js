import mongoose from 'mongoose';

// Definir el esquema para los tickets
const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
});

// Crear el modelo Ticket basado en el esquema
const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
