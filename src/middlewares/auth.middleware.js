import axios from 'axios';
import jwt from 'jsonwebtoken'; 

export const isAdmin = (req, res, next) => {
    // Obtener el token JWT del encabezado de autorización
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado' });
    }

    // Configurar los headers de la solicitud HTTP
    const headers = {
        'Authorization': `Bearer ${token}`
    };

    // Hacer una solicitud HTTP al servidor backend
    axios.get('/check-admin', { headers })
        .then(response => {
            // Si la respuesta indica que el usuario es administrador, pasar al siguiente middleware o ruta
            next();
        })
        .catch(error => {
            // Si hay un error o la respuesta indica que el usuario no es administrador, enviar una respuesta de acceso no autorizado
            return res.status(403).json({ message: 'Acceso prohibido para usuarios no administradores' });
        });
};
