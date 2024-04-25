import { addLogger } from "../utils/logger.js";

/* 
export default class CustomError{
    static createError({name="error", cause, message, code=1}){
        const error = new Error(message, {cause});
        error.name=name;
        error.code=code;
        throw error;
    }
    
} */

export default class CustomError {
    static createError({ name = 'error', cause, message, code = 1 }) {
        // Crea un objeto de error personalizado
        const error = {
            name: name,
            message: message,
            code: code,
            cause: cause,
        };

        // Registra el error utilizando el logger
        logger.error(`${name}: ${message}`, { cause });

        // No lanzamos la excepción, simplemente retornamos el objeto de error
        return error;
    }
}