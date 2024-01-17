import { promises as fs } from "fs";


class ProductManager {
    #id = 0;
    products = [];
    patch;

    constructor() {
        this.patch = "./products.json";
    }

    addProduct = async (product) => {
        const { title, code, ...rest } = product;
        const id = ++this.#id;  
        const newProduct = {
            title,
            code,
            ...rest,
            id,
        };

        // Validar que no se repita el campo "code"()
        if (!this.codigoUnico(code)) {
            console.error("ERROR: Ya existe un producto con el mismo código, el nuevo producto no será agregado, verifique el código y vuelva a intentarlo");
            return;
        }

        try {
            // Leer el contenido actual del archivo utilizando readProducts
            const currentProducts = await this.readProducts();

            // Agregar el nuevo producto a la lista existente
            currentProducts.push(newProduct);

            // Escribir la lista completa de productos de vuelta al archivo
            await fs.writeFile(this.patch, JSON.stringify(currentProducts, null, 2));

            // Actualizar la lista de productos en la instancia de ProductManager
            this.products = currentProducts;
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    }

    codigoUnico = (code) => {
        return !this.products.some(product => product.code === code);
    }

    readProducts = async () => {
        const respuesta = await fs.readFile(this.patch, "utf-8")
        this.products = JSON.parse(respuesta)
        return this.products;
    }

    getProducts = async () => {
        try {
            const respuesta2 = await this.readProducts();
            console.log("La lista de productos es la siguiente: ", respuesta2);
            return respuesta2;
        }
        catch (error) {
            console.error("ERROR al leer el archivo:", error);
        }
    };

    getProductById = async (id) => {
        const respuesta3 = await this.readProducts();
        const product = respuesta3.find(product => product.id === parseInt(id));

        if (product) {
            console.log("Producto encontrado:", product);
            return product;
        } else {
            console.error("Producto no encontrado");
            return undefined;
        }
    };

    /* Crear esta funcion */
    getProductLimit = async (limit) => {
        const products = await this.readProducts();
        const limitedProducts = products.slice(0, limit);
        console.log(`Mostrando los primeros ${limit} productos:`, limitedProducts);
        return limitedProducts;
    };

    /* Borrar un producto por ID
     */
    deleteProductsById = async (id) => {
        try {
            const respuesta4 = await this.readProducts();
            const productToDelete = respuesta4.find(products => products.id === id)

            if (!productToDelete) {
                console.error("El producto que intenta eliminar no existe");
            }
            else {
                const productDelete = respuesta4.filter(products => products.id !== id);
                this.products = productDelete;
                await fs.writeFile(this.patch, JSON.stringify(productDelete))
                console.log("Producto eliminado")
            }

        }
        catch (error) {
            console.error(error.message)
        }

    }

    /* Modificar el archivo existente sin cambiarle el ID */
    updateProduct = async ({ id, ...updatedFields }) => {
        const products = await this.readProducts();
        const updatedProducts = products.map(product => {
            if (product.id === id) {
                return { ...product, ...updatedFields };
            }
            return product;
        });

        await fs.writeFile(this.patch, JSON.stringify(updatedProducts));
        console.log("Producto actualizado:", updatedProducts);

    }
}

/* Agregando productos y mostrandolos en la consola */

const manager = new ProductManager();
/* await manager.addProduct("aspiradora", "aspiradora de solidos y liquidos", 250000, "sin imagen", 1224, 25);
await manager.addProduct("lavadora", "lava secadora", 85000, "sin imagen", 1285, 30);
await manager.addProduct("lavador", "lavador  verde", 58000, "sin imagen", 1289, 10);  */

/* Producto con igual code para comprobar errores */

/* await manager.addProduct("lavadojh", "lavadofgfdr  verde", 58.5000, "sin imagen", 1289, 170);  */

/* probando ver lista de productos en general */
await manager.getProducts();

/* Probando busqueda con ID, por true y por false*/

await manager.getProductById('db8bdd00-5261-45dd-a9af-d8ac903a860b');
await manager.getProductById(5);  

/* Probando eliminar productos por id */

/* await manager.deleteProductsById(2)  */

/* Probando modificar un producto */

/* await manager.updateProduct({
    id: 3,
    price: 77000,
    
}); */


export default ProductManager;