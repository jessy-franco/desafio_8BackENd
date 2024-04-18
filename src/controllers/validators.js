import CustomError from "../middlewares/customError.js"
import EErrors from "../middlewares/enums.js";
import {
    generateUserErrorInfo,
    generateUserErrorLogin,
    generateUserErrorEmail,
    generateUserErrorPassword
} from "../middlewares/errorUsers.js";


// Validar el formato del correo electrónico usando una expresión regular
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validar que la contraseña tenga al menos 6 caracteres (cambie a 4, despues hago la conversion a 6)
const validatePassword = (password) => {
    return password.length >= 4;
};

const validateRegistrationData = (userData) => {
    const { first_name, last_name, email, age, password } = userData;

    // Verificar si se proporcionan todos los campos
    if (!first_name || !last_name || !email || !age || !password) {
        CustomError.createError({
            name: "Error de registro",
            cause: generateUserErrorInfo({ first_name, last_name, age, email }),
            message: "Ingrese todos los campos",
            code: EErrors.INVALID_TYPES_ERROR
        })
    }

    // Validar que la edad sea un número válido
    const ageAsInt = parseInt(age);
    if (isNaN(ageAsInt)) {
        return { success: false, error: "Invalid age" };
    }

    // Utilizar las funciones de validación exportadas
    if (!validateEmail(email)) {
        /* return { success: false, error: "Invalid email format" }; */
        CustomError.createError({
            name: "Error de registro",
            cause: generateUserErrorEmail({ email }),
            message: "Formato invalido",
            code: EErrors.INVALID_TYPES_ERROR
        })
    }

    if (!validatePassword(password)) {
        /* return { success: false, error: "Password must be at least 6 characters long" }; */
        CustomError.createError({
            name: "Error de registro",
            cause: generateUserErrorPassword({ password }),
            message: "El password debe tener mas de 6 caracteres",
            code: EErrors.INVALID_TYPES_ERROR
        })
    }

    return { success: true };
};

const validateLoginData = (email, password) => {
    if (!email || !password) {
        /* return { success: false, error: "Ingrese todos los campos" }; */
        CustomError.createError({
            name: "Error de logueo",
            cause: generateUserErrorLogin({ email, password }),
            message: "Ingrese todos los campos",
            code: EErrors.INVALID_TYPES_ERROR
        })
    }

    return { success: true };
};


export { validateRegistrationData, validateLoginData };



