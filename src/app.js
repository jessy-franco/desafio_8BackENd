import express from "express";
import ProductManager from "./productManager.js";

const productManager = new ProductManager();
const app = express();

app.use(express.urlencoded({ extended: true }))

app.get("/products", async (req, res) => {
    try {
        let products;
        if (req.query.limit) {
            const limit = parseInt(req.query.limit);
            products = await productManager.getProductLimit(limit);
        } else {
            products = await productManager.getProducts();
        }

        res.send(products);
    }
    catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    };

});




app.get("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productManager.getProductById(id);

        if (product) {
            console.log("Producto encontrado:", product);
            res.send(product);
        } else {
            console.error("Producto no encontrado");
            res.status(404).send("El producto no existe");
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error del servidor");
    }
});

app.listen(6000, () => {
    console.log("servidor 3000!");
});