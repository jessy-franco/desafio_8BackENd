import { Router } from "express";
import ProductManager from "../productManager.js";

const products = Router();
const productManager = new ProductManager();

/* muestra los prod */
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
/* muestra los prod por id */
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
/* ruta para agregar prod */
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
/* ruta para actualizar prod */
products.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const updatedFields = req.body;

        /* Validar que el producto exista antes de actualizar */
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).send({ error: "El producto no existe" });
        }

        const updatedProduct = await productManager.updateProduct({ pid, ...updatedFields });
        console.log("Producto actualizado:", updatedProduct);
        if (updatedProduct) {
            res.send(updatedProduct);
        } else {
            console.error("El producto no existe");
            res.status(404).send({ error: "El producto no existe", details: error });
        }
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).send({ error: "Error del servidor", details: error.stack });
    }
});

/* Ruta para eliminar un producto por ID */
products.delete("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;

        const deletedProduct = await productManager.deleteProductsById(pid);

        if (deletedProduct) {
            res.status(200).json({ message: "Producto eliminado correctamente", deletedProduct });
        } else {
            console.error("El producto no existe");
            res.status(404).send("El producto no existe");
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).send("Error del servidor");
    }
});


export default products