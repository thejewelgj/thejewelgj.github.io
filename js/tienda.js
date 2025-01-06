const productosContainer = document.getElementById("productos-container");
const carritoItems = document.getElementById("carrito-items");
const totalPrecio = document.getElementById("total-precio");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const finalizarCompraBtn = document.getElementById("finalizar-compra");

let carrito = []; // Array para almacenar los productos del carrito

const productosJSON = "../data/productos.json";

// Función para cargar productos desde el archivo JSON
async function cargarProductos() {
    try {
        const respuesta = await fetch(productosJSON);
        const productos = await respuesta.json();

        productos.forEach(producto => {
            const productoDiv = document.createElement("div");
            productoDiv.classList.add("producto");
            productoDiv.innerHTML = `
                <img src="../img/${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <span class="precio">${producto.precio} €</span>
                <label for="cantidad-${producto.id}">Cantidad:</label>
                <input type="number" id="cantidad-${producto.id}" value="1" min="1" class="input-cantidad">
                <button class="btn-agregar" data-id="${producto.id}">Añadir al carrito</button>
            `;
            productosContainer.appendChild(productoDiv);
        });

        agregarEventosCarrito();
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

// Función para manejar la lógica de añadir al carrito
function agregarEventosCarrito() {
    const botonesAgregar = document.querySelectorAll(".btn-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", () => {
            const idProducto = parseInt(boton.getAttribute("data-id"));
            const cantidadInput = document.getElementById(`cantidad-${idProducto}`);
            const cantidad = parseInt(cantidadInput.value);
            agregarAlCarrito(idProducto, cantidad);
        });
    });
}

// Función para agregar un producto al carrito
function agregarAlCarrito(idProducto, cantidad) {
    const productoExistente = carrito.find(item => item.id === idProducto);

    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        fetch(productosJSON)
            .then(respuesta => respuesta.json())
            .then(productos => {
                const producto = productos.find(p => p.id === idProducto);
                carrito.push({ ...producto, cantidad });
                actualizarCarrito();
            });
    }
    actualizarCarrito();
}

// Función para actualizar el contenido del carrito
function actualizarCarrito() {
    carritoItems.innerHTML = "";
    let total = 0;

    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const carritoDiv = document.createElement("div");
        carritoDiv.classList.add("carrito-item");
        carritoDiv.innerHTML = `
            <p>${producto.nombre} (x${producto.cantidad}) - ${subtotal.toFixed(2)} €</p>
            <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
        `;
        carritoItems.appendChild(carritoDiv);
    });

    totalPrecio.textContent = `${total.toFixed(2)} €`;

    agregarEventosEliminar();
}

// Función para eliminar un producto del carrito
function agregarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll(".btn-eliminar");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", () => {
            const idProducto = parseInt(boton.getAttribute("data-id"));
            carrito = carrito.filter(item => item.id !== idProducto);
            actualizarCarrito();
        });
    });
}

// Función para vaciar el carrito
vaciarCarritoBtn.addEventListener("click", () => {
    carrito = [];
    actualizarCarrito();
});

// Función para finalizar la compra sin ventana emergente
finalizarCompraBtn.addEventListener("click", () => {
    const mensajeCompra = document.getElementById("mensaje-compra");

    if (carrito.length === 0) {
        mensajeCompra.innerHTML = `<p style="color: red;">Tu carrito está vacío. ¡Añade productos antes de finalizar la compra!</p>`;
        mensajeCompra.style.display = "block";
        return;
    }

    const resumenCompra = carrito
        .map(item => `${item.nombre} (x${item.cantidad}) - ${(item.precio * item.cantidad).toFixed(2)} €`)
        .join("<br>");
    const totalCompra = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    mensajeCompra.style.display = "block";
    mensajeCompra.innerHTML = `
        <h2>¡Gracias por tu compra!</h2>
        <p>Resumen de tu pedido:</p>
        <p>${resumenCompra}</p>
        <p><strong>Total: ${totalCompra.toFixed(2)} €</strong></p>
    `;

    carrito = []; // Vaciar el carrito tras finalizar la compra
    actualizarCarrito();
});

// Cargar productos al cargar la página
cargarProductos();


