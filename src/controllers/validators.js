// Validar el formato del correo electrónico usando una expresión regular
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validar que la contraseña tenga al menos 6 caracteres
const validatePassword = (password) => {
    return password.length >= 6;
};

const validateRegistrationData = (userData) => {
    const { first_name, last_name, email, age, password } = userData;

    // Verificar si se proporcionan todos los campos
    if (!first_name || !last_name || !email || !age || !password) {
        return { success: false, error: "Missing data" };
    }

    // Validar que la edad sea un número válido
    const ageAsInt = parseInt(age);
    if (isNaN(ageAsInt)) {
        return { success: false, error: "Invalid age" };
    }

    // Utilizar las funciones de validación exportadas
    if (!validateEmail(email)) {
        return { success: false, error: "Invalid email format" };
    }

    if (!validatePassword(password)) {
        return { success: false, error: "Password must be at least 6 characters long" };
    }

    return { success: true };
};

const validateLoginData = (email, password) => {
    if (!email || !password) {
        return { success: false, error: "Ingrese todos los campos" };
    }

    return { success: true };
};


export { validateRegistrationData, validateLoginData };



