import express from "express";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import products from "./routes/productsRouter.js"
/* import carts from "./routes/cartsRouter.js" */


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const routerproducts= products;
/* const routercarts= carts */

/* middlewares */
app.use(express.json());
app.use("/static",express.static(__dirname + "/public"))

/* routers */
app.use("/api/products" ,routerproducts)
/* app.use("/api/carts/" ,routercarts) */
app.use(express.urlencoded({ extended: true }))



app.listen(8080, () => {
    console.log("servidor 8080!");
});