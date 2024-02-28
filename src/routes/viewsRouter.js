import Router from "express";
import express from "express";
import UsersDao from "../daos/userDao.js";

const viewsRouter = express.Router();
/* registrarse */
viewsRouter .get("/register", (req,res)=>{
    res.render("register")
})


/* login con session */
viewsRouter.get("/login", (req,res)=>{
    if(req.session.user){
        res.redirect("/panel", { 
            style:"style.css",
        })

    }
    else{
        res.render("login", {
            style: "style.css"
        });
    }
    
});
viewsRouter .get("/panel", async (req, res)=>{
    if(req.session.user){
        let user = await UsersDao.getUserByID(req.session.user);
        res.render("panel", { 
            user,
            style:"style.css",
        })
    }
    else{
        res.redirect("/login")
    }

    
})

export default viewsRouter ;