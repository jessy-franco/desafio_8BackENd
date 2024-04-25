import Ticket from './models/ticket.Schema';
import errorHandler from "../middlewares/errorMiddlewares.js"

const ticketDao = {
    // Función para crear un nuevo ticket
    create: async (ticketData) => {
        try {
            const newTicket = new Ticket(ticketData);
            const savedTicket = await newTicket.save();
            return savedTicket;
        } catch (error) {
            console.error('Error al crear un nuevo ticket:', error);
            errorHandler({ code: 'ERROR_CREATE_TICKET', message: error.message }, req, res);
            
        }
    }
};

export default ticketDao;
