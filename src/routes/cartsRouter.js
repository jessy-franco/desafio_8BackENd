import { Router } from "express";
import { CartManager } from "../daos/cartDao.js";
import CartModel from "../daos/models/cartSchema.js";

const carts = Router();
const cartManager = new CartManager();

/* Creación de un nuevo carrito, desde postman crea un nuevo carrito, sino al ingresar por ruta get lo crea tambien desde el servidor*/
carts.post("/", async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.status(201).send(cart);
    } catch (error) {
        console.error("Error al crear un nuevo carrito:", error);
        res.status(500).send("Error del servidor");
    }
});


/* Crear un nuevo carrito si no existe y mostrar el carrito si existe */
/* no se ve el carrito por postman  pero si lo crea en mongo db atlas y con metodo post desde postman agrega los productos al carrito usando el _id*/
carts.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        let cart = await cartManager.getCartById(cid); 

        if (!cart) {
            // Si el carrito no existe, crear uno nuevo
            cart = await cartManager.createCart();
        }

        // Renderizar la vista del carrito
        res.render("cart", {
            cart,
            styles: "cartStyle.css",
        });

        // Llamar a la función environment para establecer la conexión y obtener los resultados paginados
        const environment = async () => {
            await mongoose.connect("mongodb+srv://jesicafranco1518:Seifer1979@cluster0.4oanjkk.mongodb.net/eccomerce?retryWrites=true&w=majority");

            let cartProducts = await CartModel.findOne({ _id: "8dbbd309-1861-40c5-a5de-b3d15981533e" }).populate("products.product")
            if (cartProducts) {
                cartProducts.products.push({ product: "65d60e2987c4f7977e0249de" }); // Añade el nuevo curso al array courses
                let result = await CartModel.updateOne({ _id: "8dbbd309-1861-40c5-a5de-b3d15981533e" }, cartProducts); // Actualiza el documento en la base de datos
                console.log(JSON.stringify(cartProducts, null, "\t"))
            } else {
                console.log("Carrito no encontrado");
            }

            // Llamar a la función environment
            environment();
        }

    
    } catch (error) {
        console.error("Error al obtener carrito por ID:", error);
        res.status(500).send("Error del servidor");
    }
});

/* Añadir un producto al carrito seleccionado funcional desde postman, agrega los productos al carrito*/
carts.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;

        let cart = await cartManager.getCartById(cid);

        if (!cart) {
            // Si no hay un carrito existente, crear uno nuevo
            cart = await cartManager.createCart();
        }

        // Agregar el producto al carrito
        await cartManager.addProductToCart(cid, pid, quantity);

        //Renderizar la página del carrito con los datos actualizados 
        res.redirect("/api/cart/" + cid);


    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).send("Error del servidor");
    }
});

/* Eliminamos un producto del carrito */
carts.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        await cartManager.removeProductFromCart(cid, pid);
        res.status(204).send();
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        res.status(500).send("Error del servidor");
    }
});
/* router para actualizar el carrito */
carts.put("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const products = req.body.products;
        await cartManager.updateCartProducts(cid, products);
        res.status(204).send();
    } catch (error) {
        console.error("Error al actualizar carrito con arreglo de productos:", error);
        res.status(500).send("Error del servidor");
    }
});
/* actualizar la cantidad de productos de un mismo producto */
carts.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;
        await cartManager.updateProductQuantity(cid, pid, quantity);
        res.status(204).send();
    } catch (error) {
        console.error("Error al actualizar cantidad de ejemplares de un producto en el carrito:", error);
        res.status(500).send("Error del servidor");
    }
});
/* eliminar todos los items del carrito  funciona perfecto por postman*/
carts.delete("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        await cartManager.clearCart(cid);
        res.status(204).send();
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito:", error);
        res.status(500).send("Error del servidor");
    }
});
export default carts;

