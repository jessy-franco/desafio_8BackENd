import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

class Cart {
    constructor() {
        this.id = uuidv4();
        this.products = [];
    }
    
    addProduct(pid, quantity = 1) {
        const existingProduct = this.products.find((product) => product.productId === pid);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            this.products.push({ pid, quantity });
        }
    }

}

class CartManager {
    carts = [];
    path = "./carrito.json";

    constructor() {
    }

    async createCart() {
        const newCart = new Cart();
        this.carts.push(newCart);

        await this.saveCarts();
        return newCart;
    }

    async getCartById(cid) {
        const cart = this.carts.find((cart) => cart.id === cid);
        return cart;
    }

    async addProductToCart(cid, pid, quantity) {
        const cart = await this.getCartById(cid);
        cart.addProduct(pid, quantity);

        console.log(`Producto ${pid} añadido al carrito ${cid}`);
        await this.saveCarts();
        return cart;
    }

    async saveCarts() {
        try {
            const data = JSON.stringify(this.carts, null, 2);
            await fs.writeFile(this.path, data);
        } catch (error) {
            console.error("Error al guardar los carritos:", error);
        }
    }
}

export { Cart, CartManager };
