import Ticket from './models/ticket.Schema';

const ticketDao = {
    // Función para crear un nuevo ticket
    create: async (ticketData) => {
        try {
            const newTicket = new Ticket(ticketData);
            const savedTicket = await newTicket.save();
            return savedTicket;
        } catch (error) {
            console.error('Error al crear un nuevo ticket:', error);
            throw new Error('Error al crear un nuevo ticket');
        }
    }
};

export default ticketDao;
