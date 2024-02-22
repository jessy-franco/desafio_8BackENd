import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    _id: String,
    products:{
        type:[
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"products"
                }
            }
        ],
        default:[]
    } /* [{
        productId: String,
        quantity: Number
    }] */
});

// Modelo de carrito
const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;