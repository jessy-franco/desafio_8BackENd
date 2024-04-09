import express from "express";
import productsController from "../controllers/productsController.js";
import { isAdmin } from "../middlewares/auth.middleware.js"

const productsRouter = express.Router();

/* ver todos los productos (Funcional) */
productsRouter.get("/", productsController.getAllProducts);

productsRouter.get("/new", isAdmin, (req, res) => {
    res.render("new-product", {
        style: "new.css",
    });
});

productsRouter.get("/:id", productsController.getProductById);

productsRouter.post("/", isAdmin, productsController.createProduct);

/* ruta para actualizar prod(funcional) */
productsRouter.put("/:_id", isAdmin, productsController.updateProduct);

/* Ruta para eliminar un producto por ID  (funcional)*/
productsRouter.delete("/:_id", isAdmin, productsController.deleteProduct);


export default productsRouter;
