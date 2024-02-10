import Products from "./models/products.schema.js";
import mongoose from "mongoose";

class ProductsDAO {

    static async getAll() {
        return Products.find().lean();
    }

    static async getAllWithStock() {
        return Products.find({ stock: { $gt: 0 } }).lean();
    }

    static async getById(id) {
        const objectId = mongoose.Types.ObjectId(id); // Convertir a ObjectId
        return Products.findById(objectId).lean(); // Usar findById para ObjectId
   /*      return Products.findOne({ _id: id }).lean(); */

    }

    static async add(title, description, code, price, stock, category, thumbnails) {
        try {
            // Verificar si el código es único
            const isUniqueCode = await this.codigoUnico(code);
            if (!isUniqueCode) {
                throw new Error('El código de producto ya está en uso');
            }

            // Si el código es único, crear y guardar el nuevo producto utilizando el método create de Mongoose
            return await Products.create({ title, description, code, price, stock, category, thumbnails });
        } catch (error) {
            console.error("Error al agregar producto:", error);
            throw error;
        }
    }

    static async codigoUnico(code) {
        try {
            // Realiza una consulta a la base de datos para verificar si existe un producto con el mismo código
            const existingProduct = await Products.findOne({ code });

            // Si no existe ningún producto con el mismo código, devuelve true (código único)
            // Si existe un producto con el mismo código, devuelve false (código no único)
            return !existingProduct;
        } catch (error) {
            console.error("Error al verificar código único:", error);
            throw error; // Puedes manejar este error según sea necesario en tu aplicación
        }
    }



    static async update(id, data) {
        return Products.findOneAndUpdate({ _id: id }, data);
    }


    static async remove(id) {
        return Products.findByIdAndDelete(id);
    }

}

export default ProductsDAO;
