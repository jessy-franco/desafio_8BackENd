import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productCollections ="products"
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    thumbnails: {
        type: [String],
         // Cambiado a un array de String
    },
});
productSchema.plugin(mongoosePaginate);
const Product = mongoose.model(/* "Product", */productCollections, productSchema);

export default Product;
