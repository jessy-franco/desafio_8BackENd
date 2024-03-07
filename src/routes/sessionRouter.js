import express from "express";
import passport from "passport";
/* import { createHash, isValidPassword } from '../utils/utils.js' */

const router = express.Router();

/* SESSION en plataforma formulario y bcrypt */


/* router.post("/register", async (req, res) => {
    
    const { first_name, last_name, email, age, password } = req.body


    if (!first_name || !last_name || !email || !age || !password) {
        res.redirect("/register");
    }
    
    const emailUsed = await UsersDao.getUserByEmail(email);

    if (emailUsed) {
        res.redirect("/register?error= El_email_ya_esta_registrado");
    }else{
        const hashedPassword = createHash(password);
        await UsersDao.insert(first_name, last_name, age, email, hashedPassword);
        res.redirect("/login");
    }

})


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
    
    if (!email || !password) {
        return res.redirect("/login?error=Ingrese_todos_los_campos");
    }

    try {
        
        let user = await UsersDao.getUserByEmail(email);
        
        if (!user) {
            return res.redirect("/login?error=Usuario_y/o_contraseña_incorrectas");
        } else {
            
            if (!isValidPassword(user, password)) {
                return res.redirect("/login?error=Usuario_y/o_contraseña_incorrectas");
            }
            
            if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                req.session.admin = true;
            } else {
                req.session.admin = false;
            }

        }
        req.session.rol = req.session.admin ? 'admin' : 'usuario';
        
        delete user.password;
        
        req.session.user = user;
        return res.redirect("/api/products?inicioSesion=true");
    }
    catch (error) {
    console.error("Error al autenticar usuario:", error);
    return res.status(500).send("Error al autenticar usuario");
}
}); */


/* SESION EN PLATAFORMA con passport-local */

router.post("/register",passport.authenticate("register",{failureRedirect:"/register?error= El_email_ya_esta_registrado"}), async (req, res) => {
    res.redirect("/login");
    console.log("User registrado con exito")
    
})




router.post("/login",passport.authenticate("login",{failureRedirect:"/login?error=Usuario_y/o_contraseña_incorrectas"}), async (req, res) => {

        // Verificar si el usuario existe
        if (!req.user) {
            return res.redirect("/login?error=El_usuario_no_existe");
        } else {
            req.session.user ={
                first_name : req.user.first_name,
                last_name : req.user.last_name,
                age: req.user.age,
                email: req.user.email
            }
            return res.redirect("/api/products?inicioSesion=true");
        }
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
        req.session.user = req.user;
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