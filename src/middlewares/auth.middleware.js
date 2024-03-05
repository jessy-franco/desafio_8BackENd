// Middleware de autorización para verificar si el usuario es administrador
export function isAdmin(req, res, next) {
    if (req.session.admin) {
        // Si el usuario es administrador, pasa al siguiente middleware o ruta
        next();
    } else {
        // Si el usuario no es administrador, redirige a una página de acceso no autorizado
        res.redirect("/login")
    }
}
