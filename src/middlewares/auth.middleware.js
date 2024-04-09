
import jwt from 'jsonwebtoken';

export const isAdmin = (req, res, next) => {
    // Obtener el token JWT del encabezado de autorización
    const token = req.cookies.jwt

    if (!token) {
        return res.status(403).json({ message: 'Acceso no autorizado, token invalido' });
    }

    // Verificar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: 'Token inválido' });
        }
        // Si el token es válido, puedes acceder a la información decodificada en `decoded`
        // Hacer lo que sea necesario con la información del usuario
        req.user = decoded; // Guardar la información decodificada en el objeto `req` para su uso posterior
        next();
    });
};
