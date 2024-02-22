import express from "express";
import ProductDAO from "../daos/productsDao.js";
import Product from "../daos/models/products.schema.js";
import mongoose from "mongoose";

const products = express.Router();

/* ver todos los productos (Funcional) */
products.get("/", async (req, res) => {
    try {
        let products
        let { limit = 12, page = 1, sort, query, stock } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        const options = {
            page,
            limit,
            lean: true
        };
        // Construir el objeto de filtro basado en la consulta
        const filter = query ? { category: query } : {};

        // Aplicar el filtro de stock si se proporciona
        if (stock === 'true') {
            products = await ProductDAO.getAllWithStock();
        } else {
            products = await ProductDAO.getAll();
        }

        // Aplicar ordenamiento si se proporciona
        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }
        // Ejecutar la consulta utilizando el método de paginación
        const result = await Product.paginate(filter, options);

        // Construir los enlaces de paginación
        const pagination = {
            currentPage: result.page,
            totalPages: result.totalPages,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : '',
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : '',
            isValid: !(page <= 0 || page > result.totalPages)
        };

        res.render("products", {
            products: result.docs,
            pagination,
            style: "products.css"
        });
        
        // Llamar a la función environment para establecer la conexión y obtener los resultados paginados
        const environment = async () => {
            await mongoose.connect("mongodb+srv://jesicafranco1518:Seifer1979@cluster0.4oanjkk.mongodb.net/eccomerce?retryWrites=true&w=majority");

            // Obtener los resultados de la página actual
            const pageSize = 12; // Tamaño de la página
            const currentPage = parseInt(req.query.page) || 1;
            const skip = (currentPage - 1) * pageSize;
            const products = await Product.find().skip(skip).limit(pageSize);

            // Contar el total de productos para calcular el número total de páginas
            const totalProducts = await Product.countDocuments();
            const totalPages = Math.ceil(totalProducts / pageSize);

            // Calcular la página anterior y siguiente
            const prevPage = currentPage > 1 ? currentPage - 1 : null;
            const nextPage = currentPage < totalPages ? currentPage + 1 : null;

            // Determinar si hay página previa y siguiente
            const hasPrevPage = currentPage > 1;
            const hasNextPage = currentPage < totalPages;

            // Construir los enlaces de paginación
            const prevLink = hasPrevPage ? `/api/products?page=${prevPage}` : null;
            const nextLink = hasNextPage ? `/api/products?page=${nextPage}` : null;

            // Construir el objeto de respuesta
            const response = {
                status: "success",
                payload: products,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: currentPage,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink
            };

            // Imprimir la respuesta
            console.log(response);
        };

        // Llamar a la función environment
        environment();
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
    
});


// Ruta para mostrar el formulario de creación de productos (Funcional)
products.get("/new", (req, res) => {
    res.render("new-product", {
        style: "new.css",
    });
});

/* Ver producto por id (Funcional) */
products.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await ProductDAO.getById(id);
        console.log("id recibido:", id)
        if (!product) {
            res.status(404).send("El producto no existe");
            return;
        }
        res.render("product", {
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            isStock: product.stock > 0,
            category: product.category,
            thumbnails: product.thumbnails,
            style: "style.css"
        });
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).send({ error: "Error del servidor", details: error.stack });
    }
});

// Ruta para procesar la creación de un nuevo producto

/* funcional */
products.post("/", async (req, res) => {
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
            const newProduct = {
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails: thumbnails || [],

            };

            // Agrega el nuevo producto a la base de datos
            console.log("Datos recibidos del formulario:", req.body);
            await ProductDAO.add(newProduct);

            // Redirige al usuario al formulario de creación de productos
            res.redirect("/api/products/");
        } else {
            // Si falta algún campo obligatorio, devuelve un error 400
            res.status(400).send("Falta completar campos obligatorios")
        }
    } catch (error) {
        // Maneja cualquier error que ocurra durante el proceso de agregar el producto
        console.error("Error al agregar producto:", error);
        res.status(500).send("Error del servidor");
    }
});

/* ruta para actualizar prod(funcional) */
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

/* Ruta para eliminar un producto por ID  (funcional)*/
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
