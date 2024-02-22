import { v4 as uuidv4 } from "uuid";
import CartModel from "./models/cartSchema.js";
/* import Product from "./models/productSchema.js"; */

class Cart {
    constructor() {
        this.id = uuidv4();
        this.products = [];
    }

    addProduct(pid, quantity = 1) {
        const existingProductIndex = this.products.findIndex(product => product.productId === pid);

        if (existingProductIndex !== -1) {
            // Si el producto ya existe en el carrito, actualiza la cantidad
            this.products[existingProductIndex].quantity += quantity;
        } else {
            // Si el producto no existe en el carrito, agrégalo
            this.products.push({ productId: pid, quantity });
        }
    }
}

class CartManager {
    constructor() { }

    async createCart() {
        const newCart = new Cart();
        const cart = new CartModel({
            _id: newCart.id,
            products: newCart.products
        });
        await cart.save();
        return newCart;
    }

    async getCartById(cid) {
        const cart = await CartModel.findById(cid);
        return cart;
    }

    async addProductToCart(cid, pid, quantity) {
        let cart = await this.getCartById(cid);
    
        if (!cart) {
            // Si no hay un carrito existente, crear uno nuevo
            cart = await this.createCart();
        }
    
        // Verificar si el producto ya existe en el carrito
        const existingProductIndex = cart.products.findIndex(product => product.productId === pid);
    
        if (existingProductIndex !== -1) {
            // Si el producto ya existe, actualizar la cantidad
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // Si el producto no existe, agregarlo al carrito
            cart.products.push({ productId: pid, quantity });
        }
    
        // Guardar los cambios en el carrito existente
        await cart.save();
    
        return cart;
    }
    

    async removeProductFromCart(cid, pid) {
        // Eliminar un producto del carrito por su ID
        await CartModel.findByIdAndUpdate(cid, {
            $pull: { products: { productId: pid } }
        });
    }

    async updateCartProducts(cid, products) {
        // Actualizar el arreglo de productos del carrito
        await CartModel.findByIdAndUpdate(cid, { products });
    }
    
    async updateProductQuantity(cid, pid, quantity) {
        // Actualizar la cantidad de ejemplares de un producto en el carrito
        await CartModel.findOneAndUpdate(
            { _id: cid, "products.productId": pid },
            { $set: { "products.$.quantity": quantity } }
        );
    }

    async clearCart(cid) {
        // Eliminar todos los productos del carrito
        await CartModel.findByIdAndUpdate(cid, { products: [] });
    }

    

}

export { Cart, CartManager };
