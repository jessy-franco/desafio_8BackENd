import { addLogger } from "../utils/logger.js";

// Mostrar la vista de prueba de logs
const showLoggerTest = (req, res) => {
    try{
        res.render('loggerTest', {
            loggerTest,
            style: "logger.css"
        });
    }
    catch(error){
        logger.error('No se pudo renderizar la pagina');
    }
    
};

// Procesar la prueba de logs
const testLogger = (req, res) => {
    try {
        // Ejemplo de registro de mensajes de log
        logger.debug('Este es un mensaje de debug');
        logger.info('Este es un mensaje de información');
        logger.warn('Este es un mensaje de advertencia');
        logger.error('Este es un mensaje de error');

        res.status(200).send('Logs probados con éxito');
    } catch (error) {
        logger.error(`Error al probar logs: ${error.message}`);
        res.status(500).send('Error al probar logs');
    }
};

export default {testLogger, showLoggerTest}
