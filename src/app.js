import express from "express";
import products from "./routes/productsRouter.js"
import carts from "./routes/cartsRouter.js"
import { engine } from 'express-handlebars';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
/* import MongoStore from "connect-mongo"; */
import router from "./routes/sessionRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
import passport from "passport";
import initializePassport from "./config/passport.config.js"


const app = express();

// View engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');



/* mongodb */

mongoose.connect("mongodb+srv://jesicafranco1518:Seifer1979@cluster0.4oanjkk.mongodb.net/eccomerce?retryWrites=true&w=majority")

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

// Routers
const routerproducts = products;
const routercarts = carts;
const routerSession = router;



app.use("/api/products", routerproducts)
app.use("/api/carts", routercarts)
app.use("/api/sessions", routerSession)
app.use("/", viewsRouter)


// Home del sitio
app.get("/", (req, res) => {
    res.redirect("/home");
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

app.listen(3000, () => {
    console.log("servidor 3000!");
});