import express from "express";
import __dirname from "./utils/utils.js";
import products from "./routes/productsRouter.js"
import carts from "./routes/cartsRouter.js" 
import { engine } from 'express-handlebars';
import mongoose from "mongoose";

const app = express();
const routerproducts= products;
const routercarts= carts 

// View engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');



/* mongodb */
mongoose.connect("mongodb+srv://jesicafranco1518:Seifer1979@cluster0.4oanjkk.mongodb.net/Tienda?retryWrites=true&w=majority")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected to MongoDB Atlas");
}); 

/* middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/static",express.static(__dirname + "/public"))

/* routers */
app.use("/api/products" ,routerproducts)
app.use("/api/carts" ,routercarts)

// Home del sitio
app.get("/", (req, res) => {
    res.redirect("/home");
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.get("/ping", (req, res) => {
    res.send("Pong!");
});

// Pagina error 404
app.use((req, res, next) => {
    res.render("404");
});



app.listen(3000, () => {
    console.log("servidor 8080!");
});