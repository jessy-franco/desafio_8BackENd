import Product from "../daos/models/products.schema.js";

class ProductDAO {
    static async getAll() {
        return Product.find().lean();
    }

    static async getById(id) {
        return Product.findById(id).lean();
    }

    static async add(productData) {
        try {
            const newProduct = await Product.create(productData);
            return newProduct.toObject();
        } catch (error) {
            console.error("Error al agregar producto en ProductDAO.add:", error);
            throw error;
        }
    }

    static async getAllWithStock() {
        return Product.find({ stock: { $gt: 0 } }).lean();
    }

    static async update(_id, newData) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(_id, newData, { new: true });
            if (!updatedProduct) {
                throw new Error("Producto no encontrado");
            }
            return updatedProduct.toObject();
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            throw error;
        }
    }

    static async remove(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new Error("Producto no encontrado");
            }
            return deletedProduct.toObject();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            throw error;
        }
    }
}

export default ProductDAO;
