import { Router } from "express";
import ProductManager from "../productManager.js";

const products = Router();
const productManager = new ProductManager();


products.get("/", async (req, res) => {
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

products.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productManager.getProductById(id);
        console.log("ID recibido:", id);

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

products.post("/", async (req, res) => {
    try {
        const {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails, } = req.body;
        if (title && description && code && price && stock && category) {
            const newProduct = {
            title, description, code, price, stock, category, thumbnails: thumbnails || [],
                status: true,
            };
            const addProd = await productManager.addProduct(newProduct);
            res.status(201).send(addProd);
            console.log(req.body)
        } else {
            res.status(400).send("Falta completar campos obligatorios")
        }
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).send("Error del servidor");
    }
}
);




export default products