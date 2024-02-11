import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    _id: String,
    products: [{
        productId: String,
        quantity: Number
    }]
});

// Modelo de carrito
const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;