import express from "express";
import productsRouter from "./routes/productsRouter.js"
import  cartsRouter from "./routes/cartsRouter.js"
import  loggerRouter from "./routes/loggerRouter.js"
import { engine } from 'express-handlebars';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
/* import MongoStore from "connect-mongo"; */
import router from "./routes/sessionRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
import passport from "passport";
import initializePassport from "./config/passport.config.js"
import {environment} from "./config/config.js"
import { generateProducts } from './services/mockService.js';
import { addLogger} from "./utils/logger.js";

const app = express();



// View engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');



/* mongodb */

mongoose.connect(environment.mongoUrl)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected to MongoDB Atlas");
});

/* middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"));
app.use(cookieParser("cookieS3cR3tC0D3"));
initializePassport();
app.use(passport.initialize());
app.use(addLogger)

// Routers
const routerproducts = productsRouter;
const routercarts =  cartsRouter;
const routerSession = router;
const routerLogger = loggerRouter;



app.use("/api/products", routerproducts)
app.use("/api/carts", routercarts)
app.use("/api/sessions", routerSession)
app.use("/", viewsRouter)
app.use("/loggerTest", routerLogger)


// Home del sitio
app.get("/", (req, res) => {
    res.redirect("/home");
});
app.get("/loggerTest", (req, res) => {
    req.logger.error("no se pudo renderizar la pagina");
    res.send({message: "prueba de logger"})
}); 
app.get("/home", (req, res) => {
    res.render("home", {
        style: "style.css"
    });
});

app.get("/ping", (req, res) => {
    res.send("Pong!");
});

// Pagina error 404
app.use((req, res, next) => {
    res.render("404", {
        style: "style.css"
    });
});

// Endpoint para generar productos falsos
app.get('/mockingproducts', (req, res) => {
    const products = generateProducts(100);
    res.json(products);
});

const PORT = environment.port || 3000;
app.listen(PORT , () => {
    console.log(`Servidor corriendo en el puerto ${PORT }`);
});