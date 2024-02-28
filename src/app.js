import express from "express";
import products from "./routes/productsRouter.js"
import carts from "./routes/cartsRouter.js"
import { engine } from 'express-handlebars';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";

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
app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
}))

// Routers
const routerproducts = products;
const routercarts = carts;


app.use("/api/products", routerproducts)
app.use("/api/carts", routercarts)



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

/* app.get("/user", (req, res)=>{
    res.render("user",{
        style:"user.css"
    })
})
 */

/* COOKIES al cliente */

/* app.get("/setSignedCookie", (req, res) => {
    res.cookie("SignedCookie", "Esta es una cookie", { maxAge:10000, signed:true}).send("Cookie establecida correctamente");
});
 */
/* crea la cookie */
app.post("/setCookie", (req, res) => {
    /* info del usuario */
    let email = req.body.email;
    let username = req.body.username;
    let signed = req.body.signed;
    let cookieValue = {};
    cookieValue[username]= email;

    res.cookie("Cookie_creada", JSON.stringify(cookieValue), { maxAge: 60000,  signed: signed  }).render("home", {
        style: "style.css"
    });

})


/* recibe la cookie y la muestra por consola */

app.get("/getCookie", (req, res) => {
    if (req.cookies.Cookie_creada ) {
        console.log(JSON.parse(req.cookies.Cookie_creada));
        res.render("home", {
            style: "style.css"
        });

    } 
    else if(req.signedCookies.Cookie_creada){
        console.log(JSON.parse(req.signedCookies.Cookie_creada));
        res.render("home", {
            style: "style.css"
        });
    }
    else {
        res.send("La cookie no está presente en la solicitud");
    }
})
/* elimina la cookie */

app.get("/deleteCookie", (req, res) => {
    if (req.cookies.Cookie_creada) {
        res.clearCookie("Cookie_creada").render("home", {
            style: "style.css"
        });
    } else {
        res.send("No existe cookie");
    }

})
/* session */
app.get("/session", (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`se ha visitado el sitio ${req.session.counter} veces`)
    }
    else {
        req.session.counter = 1;
        res.send("¡¡¡Bienv3nidx!!!")
    }
    console.log("sessionID: ",req.sessionID)
})

/* Eliminar datos del session */

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (!err) res.render("panel", { 
            cierreSession: true,
            style:"style.css",
        })
        else res.send({ status: "Error al cerrar sesión", body: err })
    })
})
/* login con session ppt */

/* app.get("/login", (req, res) => {
    const { username, password } = req.query
    if (username !== 'Subtren' || password !== 'Erias') {
        return res.send('login failed')
    }
    req.session.user = username
    req.session.admin = true
    res.send('login success!')
})
function auth(req, res, next) {
    if (req.session?.user === 'Subtren' && req.session?.admin) {
        return next()
    }
    return res.status(401).send('error de autorización!')
}

app.get('/panel', auth, (req, res) => {
    res.send('si estas viendo esto es porque ya te logueaste!')
}) */

/* login con session profe */
app.get("/login", (req,res)=>{
    if(req.session.user){
        res.render("panel", { 
            style:"style.css",
        })

    }
    else{
        res.render("home", {
            style: "style.css"
        });
    }
    
});
app.get("/panel", (req, res)=>{
    if(req.session.user){
        let user = req.session.user;
        let is_admin = req.session.is_admin;
    }

    res.render("panel", { 
        style:"style.css",
    })
})

app.post("/login", (req, res)=> {
    let username= req.body.username
    let password= req.body.password;
    if(username =="admin"&&password == "admin"){
        req.session.user = "admin";
        req.session.is_admin = true;
        res.render("panel", {
            user: username,
            style:"style.css",
        })
    }
    else if(username == "Subtren" && password =="Erias123"){
        req.session.user = "subtren";
        req.session.is_admin = false;
        res.render("panel",{
            user: username,
            style:"style.css",
        })
    }
    else{
        res.send("Error de credenciales")
    }
}) 
// Pagina error 404
app.use((req, res, next) => {
    res.render("404", {
        style: "style.css"
    });
});

app.listen(3000, () => {
    console.log("servidor 3000!");
});