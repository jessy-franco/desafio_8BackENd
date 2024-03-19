import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import UsersDao from "../daos/userDao.js";

const router = express.Router();


/* jwt */
router.post("/register", async (req, res) => {

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let age = parseInt(req.body.age);
    let password = req.body.password;

    if (!first_name || !last_name || !email || !age || !password) {
        res.status(400).json({ status: 400, error: "Missing data" });
    }

    let emailUsed = await UsersDao.getUserByEmail(email);

    if (emailUsed) {
        res.status(400).json({ status: 400, error: "Email already used" });
    } else {
        await UsersDao.insert(first_name, last_name, age, email, password);
        res.status(200).json({ status: 200, error: "User created" });
    }

})

router.post("/login", async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        /* res.status(400).json({status:400, error:"Missing credentials"}) */
        return res.redirect("/login?error=Ingrese_todos_los_campos");
    }

    let user = await UsersDao.getUserByCreds(email, password);

    if (!user) {
        /* res.status(404).json({status:404, error:"User not found"}) */
        return res.redirect("/login?error=Usuario_y/o_contraseña_incorrectas");
    } else {

        let token = jwt.sign({ id: user._id }, 'secret_jwt', { expiresIn: '1h' });

        res.cookie("jwt", token, {
            signed: true,
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        })
    }
    return res.redirect("/api/products?inicioSesion=true");
});

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json(req.user);
});

router.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    /* res.status(200).json({status:200, msg:"Logged out"}); */
    return res.redirect("/home?cierre_de_sesion_ok")
});



/* SESION CON GITHUB */

router.get("/github", (req, res, next) => {
    // Verificar si el usuario ya está autenticado
    if (req.isAuthenticated()) {
        /* Si el usuario ya está autenticado, redirigirlo a la página de productos con la señal de inicio de sesión */
        return res.redirect("/api/products?inicioSesion=true");
    }
    /* Si el usuario no está autenticado, continuar con el proceso de autenticación de GitHub */
    passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
});

router.get("/githubcallback", async (req, res) => {
    try {
        // Intentar autenticar al usuario con Passport
        await new Promise((resolve, reject) => {
            passport.authenticate("github", (err, user) => {
                if (err) {
                    // Si hay un error, rechazar la promesa con el error
                    return reject(err);
                }
                // Si el usuario se autentica correctamente, resolver la promesa con el usuario
                resolve(user);
            })(req, res);
        });

        // Si llegamos a este punto, significa que el usuario se autenticó correctamente
        
        res.redirect("/api/products?inicioSesion=true");
    } catch (error) {
        // Si se produce un error durante la autenticación, manejarlo aquí
        console.error("Error durante la autenticación:", error);
        res.redirect("/login?error=Usuario_y/o_contraseña_incorrectas");
    }
});

router.get('/logout/github', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err); // Manejar errores si ocurren
        }
        res.redirect('/login?Usuario_deslogueado'); // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión correctamente
    });
});

export default router;