
import jwt from 'jsonwebtoken';

export const isAdmin = (req, res, next) => {
    // Obtener el token JWT del encabezado de autorización
    const token = req.cookies

    if (!token) {
        return res.status(403).json({ message: 'Acceso no autorizado, token invalido' });
    }

    // Verificar el token
    jwt.verify(token, 'secreto', (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: 'Token inválido' });
        }
        // en decoded vas a tener toda la informacion del usuario
        // aca hace lo que quieras
        next();
    });
};
