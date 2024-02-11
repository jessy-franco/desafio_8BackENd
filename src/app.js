import express from "express";
import __dirname from "./utils/utils.js";
import path from 'path';
import products from "./routes/productsRouter.js"
import carts from "./routes/cartsRouter.js"
import router from "./routes/views.router.js"
import { engine } from 'express-handlebars';
import mongoose from "mongoose";
import { Server } from 'socket.io'

const app = express();

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
app.use("/public", express.static(path.join(__dirname, "public")));


// Routers
const routerproducts = products;
const routercarts = carts;
const routerChat= router

app.use("/api/products", routerproducts)
app.use("/api/carts", routercarts)
app.use("/chat", routerChat)

// Home del sitio
app.get("/", (req, res) => {
    res.redirect("/home");
});

app.get("/home", (req, res) => {
    res.render("home");
});
app.get("/chat", (req, res) => {
    res.render("chat");
});

app.get("/ping", (req, res) => {
    res.send("Pong!");
});

// Pagina error 404
app.use((req, res, next) => {
    res.render("404");
});



const httpServer = app.listen(3000, () => {
    console.log("servidor 3000!");
});
const io = new Server(httpServer);
let messages = [];
io.on('connection', socket => {
    console.log('Nuevo cliente conectado')

    socket.on('message', data => {
        messages.push(data)
        io.emit('messageLogs', messages)
    })
    socket.on("login", data => {
        socket.emit('messageLogs', messages)
        /* broadcast, todos los usuarios menos el que esta ahora */
        socket.broadcast.emit("register", data)
    })
})