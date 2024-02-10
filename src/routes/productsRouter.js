import { Router } from "express";
import upload from "../utils/upload.middleware.js"
import ProductsDAO from "../daos/productsDao.js";

const products = Router();



/* muestra los prod */
products.get("/", async (req, res) => {
    try {
        let products;
        let withStock = req.query.stock;
        if (req.query.limit) {
            const limit = parseInt(req.query.limit);
            products = await ProductsDAO.getProductLimit(limit);
        } 
        else if(withStock === undefined){
            products = await ProductsDAO.getAll();
        }
        else {
            products = await ProductsDAO.getAllWithStock();
        }

        res.render("products",{products});

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
        const product = await ProductsDAO.getById(id);
        console.log("ID recibido:", id);

        if (product) {
            console.log("Producto encontrado:", product);
            res.render("product",{
                title:product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                isStock: product.stock > 0,
                category: product.category,
                thumbnails:product.thumbnails
            });
        } else {
            console.error("Producto no encontrado");
            res.status(404).send("El producto no existe");
            res.redirect("/api/products/");
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(404).send({ error: "El producto no existe", details: "no se puede actualizar un producto que no existe" });
    }
});

/* ruta para actualizar prod */
products.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const updatedFields = req.body;

        /* Validar que el producto exista antes de actualizar */
        const product = await ProductsDAO.getById(pid);
        if (!product) {
            return res.status(404).send({ error: "El producto no existe" });
        }

        const updatedProduct = await ProductsDAO.update(pid, updatedFields);

        console.log("Producto actualizado:", updatedProduct);
        if (updatedProduct) {
            res.render(updatedProduct);
        } else {
            console.error("El producto no existe");
            res.status(404).send({ error: "El producto no existe", details: "no se puede actualizar un producto que no existe" });
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

        const deletedProduct = await ProductsDAO.remove(pid);

        if (deletedProduct) {
            res.status(200).json({ message: "Producto eliminado correctamente", deletedProduct });
        } else {
            console.error("El producto no existe");
            res.status(404).send("El producto no existe");
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(404).send({ error: "El producto no puede borrarse", details: "no se puede borrar un producto que no existe" });
    }
});


/* ruta para agregar prod */
products.post("/new", async (req, res) => {
    res.render("new-product");
}
);

products.post("/", upload.single('image'), async (req, res) => {
    try {
        const {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails
        } = req.body;

        // Verifica si todos los campos obligatorios están presentes
        if (title && description && code && price && stock && category) {
            const filename = req.file.filename; // Obtener el nombre del archivo subido
            const newProduct = {
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails: thumbnails || [], // Si thumbnails está indefinido, establece un array vacío
                image: filename // Agrega el nombre del archivo como parte del producto
            };

            // Agrega el nuevo producto a la base de datos
            await ProductsDAO.add(newProduct);

            // Redirige al usuario a la página de productos
            res.redirect("/api/products");
        } else {
            // Si falta algún campo obligatorio, devuelve un error 400
            res.status(400).send("Falta completar campos obligatorios");
        }
    } catch (error) {
        // Maneja cualquier error que ocurra durante el proceso de agregar el producto
        console.error("Error al agregar producto:", error);
        res.status(500).send("Error del servidor");
    }
});



export default products