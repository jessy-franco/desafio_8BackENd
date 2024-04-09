import Ticket from '../daos/models/ticket.Schema.js'; // Importar el modelo Ticket

const ticketService = {
    // Función para generar un ticket de compra
    generateTicket: async (amount, purchaserEmail) => {
        try {
            const code = generateUniqueCode(); // Función para generar un código único
            const ticketData = {
                code,
                amount,
                purchaser: purchaserEmail
            };

            const newTicket = new Ticket(ticketData);
            const savedTicket = await newTicket.save();
            return savedTicket;
        } catch (error) {
            console.error('Error al generar el ticket de compra:', error);
            throw new Error('Error al generar el ticket de compra');
        }
    }
};

// Función para generar un código único (por ejemplo, un UUID)
function generateUniqueCode() {
    return 'TICKET_' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

export default ticketService;
