import express from "express";
import ProductDAO from "../daos/productsDao.js";
import multer from "multer";

const products = express.Router();
const upload = multer({ dest: 'src/public/img/products/' });

products.get("/", async (req, res) => {
    try {
        let products;
        let withStock = req.query.stock;
        if (req.query.limit) {
            const limit = parseInt(req.query.limit);
            products = await ProductDAO.getProductLimit(limit);
        } 
        else if(withStock === undefined){
            products = await ProductDAO.getAll();
        }
        else {
            products = await ProductDAO.getAllWithStock();
        }

        res.render("products",{
            products,
            style:"style.css",
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});


// Ruta para mostrar el formulario de creación de productos
products.get("/new", (req, res) => {
    res.render("new-product",{
        style:"new.css",
    });
});


products.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await ProductDAO.getById(id);
        console.log("id recibido:", id)
        if (!product) {
            res.status(404).send("El producto no existe");
            return;
        }
        res.render("product",{
            title:product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            isStock: product.stock > 0,
            category: product.category,
            thumbnails:`static/img/products/${product.image}`,
            style:"style.css"
        });
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).send({ error: "Error del servidor", details: error.stack });
    }
});

// Ruta para procesar la creación de un nuevo producto
products.post("/", upload.single('image'), async (req, res) => {
    try {
        const {
            title,
            description,
            code,
            price,
            stock,
            category
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
                image: filename // Agrega el nombre del archivo como parte del producto
            };

            // Agrega el nuevo producto a la base de datos
            await ProductDAO.add(newProduct);

            // Redirige al usuario al formulario de creación de productos
            res.redirect("/api/products/");
        } else {
            // Si falta algún campo obligatorio, devuelve un error 400
            res.status(400).send("Falta completar campos obligatorios");
            console.log(error, details)
        }
    } catch (error) {
        // Maneja cualquier error que ocurra durante el proceso de agregar el producto
        console.error("Error al agregar producto:", error);
        res.status(500).send("Error del servidor");
    }
});

/* ruta para actualizar prod */
products.put("/:_id", async (req, res) => {
    try {
        const pid = req.params._id;
        const updatedFields = req.body;

        /* Validar que el producto exista antes de actualizar */
        const product = await ProductDAO.getById(pid);
        if (!product) {
            return res.status(404).send({ error: "El producto no existe" });
        }

        const updatedProduct = await ProductDAO.update(pid, updatedFields);

        console.log("Producto actualizado:", updatedProduct);
        // Redirigir a la vista del producto actualizado
        if (updatedProduct) {
            res.redirect(`/api/products/${pid}`);
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
products.delete("/:_id", async (req, res) => {
    try {
        const pid = req.params._id;

        const deletedProduct = await ProductDAO.remove(pid);

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


export default products;
