import express from "express";
import UsersDao from "../daos/userDao.js";
import { createHash, isValidPassword } from '../utils/utils.js'

const router = express.Router();

/* registrarse */
router.post("/register", async (req, res) => {
    /* corrección 1 */
    const { first_name, last_name, email, age, password } = req.body


    if (!first_name || !last_name || !email || !age || !password) {
        res.redirect("/register");
    }
    /* corrección 2 */
    const emailUsed = await UsersDao.getUserByEmail(email);

    if (emailUsed) {
        res.redirect("/register?error= El_email_ya_esta_registrado");
    }else{
        const hashedPassword = createHash(password);
        await UsersDao.insert(first_name, last_name, age, email, hashedPassword);
        res.redirect("/login");
    }

})
/* Eliminar datos del session */

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (!err) res.render("login", {
            cierreSession: true,
            style: "style.css",
        })
        else res.send({ status: "Error al cerrar sesión", body: err })
    })
})


router.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    // Verificar si se proporcionaron tanto el correo electrónico como la contraseña
    if (!email || !password) {
        return res.redirect("/login?error=Ingrese_todos_los_campos");
    }

    try {
        // Obtener el usuario de la base de datos
        let user = await UsersDao.getUserByEmail(email);

        // Verificar si el usuario existe
        if (!user) {
            return res.redirect("/login?error=Usuario_y/o_contraseña_incorrectas");
        } else {
            // Verificar si la contraseña es válida
            if (!isValidPassword(user, password)) {
                return res.redirect("/login?error=Usuario_y/o_contraseña_incorrectas");
            }
            // Verificar si el usuario es administrador
            if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                req.session.admin = true;
            } else {
                req.session.admin = false;
            }

        }

        // Establecer el rol del usuario
        req.session.rol = req.session.admin ? 'admin' : 'usuario';
        // Eliminar la contraseña del usuario de la sesión
        delete user.password;
        // Establecer la sesión de usuario
        req.session.user = user;
        return res.redirect("/api/products?inicioSesion=true");
    }
    catch (error) {
    console.error("Error al autenticar usuario:", error);
    return res.status(500).send("Error al autenticar usuario");
}
});



export default router;