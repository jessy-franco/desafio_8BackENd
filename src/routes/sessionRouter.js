import express from "express";
import UsersDao from "../daos/userDao.js";

const router = express.Router();

/* registrarse */
router.post("/register", async (req, res) => {

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let age = parseInt(req.body.age);
    let password = req.body.password;

    if(!first_name || !last_name || !email || !age || !password){
        res.redirect("/register",{
            style:"style.css",
    });
    }

    let emailUsed = await UsersDao.getUserByEmail(email);

    if(emailUsed){
        res.redirect("/register");
    } else {
        await UsersDao.insert(first_name,last_name,age,email,password);
        res.redirect("/login");
    }

})
/* Eliminar datos del session */

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (!err) res.render("panel", { 
            cierreSession: true,
            style:"style.css",
        })
        else res.send({ status: "Error al cerrar sesión", body: err })
    })
})



router.get("/panel", async (req, res)=>{
    if(req.session.user){
        let user = await UsersDao.getUserByID(req.session.user);
        
        let is_admin = req.session.is_admin;
    }

    const error = req.query.error;

    res.render("panel", { 
        user,
        style: "style.css",
    });
})
/* 
router.post("/login", async (req, res)=> {
    let email= req.body.email;
    let password= req.body.password;
    if(!email || !password){
        res.redirect("/login");
    }
    let user = await UsersDao.getUserByCreds(email, password);
    
    if(!user){
        return res.redirect("/login?error=usuario_no_existe");
    } else {
        req.session.user = user._id;
        res.redirect("/panel")
    }
})  
 */
router.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    
    // Verificar si se proporcionaron tanto el correo electrónico como la contraseña
    if (!email || !password) {
        return res.redirect("/login?error=Ingrese_todos_los_campos");
    }

    try {
        // Buscar al usuario en la base de datos
        let user = await UsersDao.getUserByCreds(email, password);
        
        // Verificar si el usuario existe
        if (!user) {
            return res.redirect("/login?error=Usuario_y/o_contraseña_incorrectas");;
        } else {
            // Establecer la sesión de usuario y redirigir al panel
            req.session.user = user._id;
            return res.redirect("/panel");
        }
    } catch (error) {
        console.error("Error al autenticar usuario:", error);
        return res.status(500).send("Error al autenticar usuario");
    }
});

export default router;