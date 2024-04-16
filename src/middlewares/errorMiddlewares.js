
const errorDictionary = {
    PRODUCT_CREATE_ERROR: 'Error al crear un nuevo producto.',
    ADD_TO_CART_ERROR: 'Error al agregar un producto al carrito.',
    CHECKOUT_ERROR:'Error al completar la compra del carrito.',
    UNKNOWN_ERROR: 'Error desconocido.',
    INTERNAL_SERVER_ERROR:'No se pudo obtener los productos.',
    ERROR_404_PRODUCT:'El producto no existe',
    MISSING_FIELDS:'Falta completar campos obligatorios',
    ERROR_DELETE:'El producto no puede borrarse',
};

function errorHandler(err, req, res, next) {
    const errorCode = err.code || 'UNKNOWN_ERROR';
    const errorMessage = errorDictionary[errorCode] || 'Error desconocido.';
    console.error('Error:', errorMessage);
    res.status(500).json({ error: errorMessage });
}

export default errorHandler;

