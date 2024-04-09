import { CartManager } from "../daos/cartDao.js";

const cartManager = new CartManager();

const cartRepository = {
    createCart: async () => {
        try {
            return await cartManager.createCart();
        } catch (error) {
            throw new Error("Error al crear un nuevo carrito");
        }
    },

    getCartById: async (cartId) => {
        try {
            let cart = await cartManager.getCartById(cartId);
            if (!cart) {
                cart = await cartManager.createCart();
            }
            return cart;
        } catch (error) {
            throw new Error("Error al obtener carrito por ID");
        }
    },

    addProductToCart: async (cartId, productId, quantity) => {
        try {
            await cartManager.addProductToCart(cartId, productId, quantity);
        } catch (error) {
            throw new Error("Error al agregar producto al carrito");
        }
    },

    removeProductFromCart: async (cartId, productId) => {
        try {
            await cartManager.removeProductFromCart(cartId, productId);
        } catch (error) {
            throw new Error("Error al eliminar producto del carrito");
        }
    },

    updateCartProducts: async (cartId, products) => {
        try {
            await cartManager.updateCartProducts(cartId, products);
        } catch (error) {
            throw new Error("Error al actualizar carrito con arreglo de productos");
        }
    },

    updateProductQuantity: async (cartId, productId, quantity) => {
        try {
            await cartManager.updateProductQuantity(cartId, productId, quantity);
        } catch (error) {
            throw new Error("Error al actualizar cantidad de ejemplares de un producto en el carrito");
        }
    },

    clearCart: async (cartId) => {
        try {
            await cartManager.clearCart(cartId);
        } catch (error) {
            throw new Error("Error al eliminar todos los productos del carrito");
        }
    }
};

export default cartRepository;
