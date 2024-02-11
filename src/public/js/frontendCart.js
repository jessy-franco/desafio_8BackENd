
document.getElementById("add-to-cart-btn").addEventListener("click", async () => {
    const productId = document.getElementById("add-to-cart-btn").dataset.productId;
    if (productId) {
        try {
            const response = await fetch(`/api/cart/:cid/products/${productId}`, {
                method: "POST",
            });

            if (response.ok) {
                swal("¡Producto agregado al carrito exitosamente!", "", "success");
                console.log("agregado")
            } else {
                swal("Error al agregar el producto al carrito", "", "error");
                console.log("error")
            }
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            swal("Error al agregar el producto al carrito", "", "error");
            console.log("error")
        }
    } else {
        console.error("No se encontró el ID del producto.");
    }
});

