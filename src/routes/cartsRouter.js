import { Router } from "express";
import { CartManager } from "../daos/cartDao.js";

const carts = Router();
const cartManager = new CartManager();

/* Creación de un nuevo carrito */
carts.post("/", async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.status(201).send(cart);
    } catch (error) {
        console.error("Error al crear un nuevo carrito:", error);
        res.status(500).send("Error del servidor");
    }
});

/* Lectura de un carrito según el ID proporcionado */
carts.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCartById(cid);
        if (cart) {
            res.render("cart",{
                cart,
                styles: cart.css,
            })
        } else {
            console.error("Carrito no encontrado");
            res.status(404).send("Carrito no encontrado");
        }
    } catch (error) {
        console.error("Error al obtener carrito por ID:", error);
        res.status(500).send("Error del servidor");
    }
});

/* Añadir un producto al carrito seleccionado */
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


export default carts;

