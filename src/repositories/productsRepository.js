import ProductDAO from "../daos/productsDao.js";

class ProductRepository {
    async getAllProducts(filterOptions) {
        try {
            let products;

            if (filterOptions.stock) {
                products = await ProductDAO.getAllWithStock();
            } else {
                products = await ProductDAO.getAll();
            }

            return products;
        } catch (error) {
            throw new Error("Error al obtener todos los productos");
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductDAO.getById(id);
            return product;
        } catch (error) {
            throw new Error(`Error al obtener el producto por ID: ${id}`);
        }
    }

    async createProduct(productData) {
        try {
            await ProductDAO.add(productData);
        } catch (error) {
            throw new Error("Error al crear un nuevo producto");
        }
    }

    async updateProduct(productId, updatedFields) {
        try {
            const product = await ProductDAO.getById(productId);
            if (!product) {
                throw new Error(`El producto con ID ${productId} no existe`);
            }

            const updatedProduct = await ProductDAO.update(productId, updatedFields);
            return updatedProduct;
        } catch (error) {
            throw new Error(`Error al actualizar el producto por ID: ${productId}`);
        }
    }

    async deleteProduct(productId) {
        try {
            const deletedProduct = await ProductDAO.remove(productId);
            return deletedProduct;
        } catch (error) {
            throw new Error(`Error al eliminar el producto por ID: ${productId}`);
        }
    }
}

export default ProductRepository;
