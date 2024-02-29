import Router from "express";
import express from "express";
/* import UsersDao from "../daos/userDao.js"; */

const viewsRouter = express.Router();
/* registrarse */
viewsRouter .get("/register", (req,res)=>{
    res.render("register",{
        style: "style.css"
    })
})


/* login con session */
viewsRouter.get("/login", (req,res)=>{
    if(req.session.user){
        res.redirect("/api/products?inicioSesion=true")

    }
    else{
        res.render("login", {
            style: "style.css"
        });
    }
    
});


export default viewsRouter ;