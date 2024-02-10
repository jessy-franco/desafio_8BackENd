import { Router } from "express";
import { CartManager } from "../daos/cartManager.js";

const carts = Router();
const cartManager = new CartManager();

/* creando carrito */
carts.post("/", async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.status(201).send(cart);
    } catch (error) {
        console.error("Error al crear un nuevo carrito:", error);
        res.status(500).send("Error del servidor");
    }
});
/* lectura de carrito segun id proporcionado */
carts.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCartById(cid);
        if (cart) {
            res.status(200).send(cart);
        } else {
            console.error("Carrito no encontrado");
            res.status(404).send("Carrito no encontrado");
        }
    } catch (error) {
        console.error("Error al obtener productos del carrito:", error);
        res.status(500).send("Error del servidor");
    }
});
/* Post de un producto en el carrito seleccionado */
carts.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;

        const cart = await cartManager.addProductToCart(cid, pid, quantity);
        res.status(200).send(cart);
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).send("Error del servidor");
    }
});

export default carts;
