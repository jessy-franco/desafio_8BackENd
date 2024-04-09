import ProductDAO from '../daos/productsDao.js'; 

const productService = {
    // Función para obtener un producto por su ID
    getProductById: async (productId) => {
        try {
            const product = await ProductDAO.getById(productId);
            return product;
        } catch (error) {
            console.error(`Error al obtener el producto por ID (${productId}):`, error);
            throw new Error("Error al obtener el producto");
        }
    },

    // Función para actualizar el stock de un producto
    updateProductStock: async (productId, newStock) => {
        try {
            await ProductDAO.updateStock(productId, newStock);
        } catch (error) {
            console.error(`Error al actualizar el stock del producto (${productId}):`, error);
            throw new Error("Error al actualizar el stock del producto");
        }
    }
};

export default productService;
