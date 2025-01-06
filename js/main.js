document.addEventListener("DOMContentLoaded", () => {
    cargarNoticias();
    cargarGaleria();
    cargarProductos();
    inicializarScroll();
    inicializarCarrusel();
    inicializarPresupuesto();
    inicializarMenuDesplegable();
});

// Cargar noticias dinámicas
function cargarNoticias() {
    const contenedorNoticias = document.getElementById("contenedor-noticias");

    if (contenedorNoticias) {
        fetch("data/noticias.json")
            .then(response => {
                if (!response.ok) throw new Error("Error al cargar el archivo JSON de noticias");
                return response.json();
            })
            .then(noticias => {
                noticias.forEach(noticia => {
                    const noticiaHTML = `
                        <div class="noticia">
                            <h3>${noticia.titulo}</h3>
                            <p>${noticia.descripcion}</p>
                            <p><small>${noticia.fecha}</small></p>
                            <a href="${noticia.enlace}" class="leer-mas">Leer más</a>
                        </div>`;
                    contenedorNoticias.innerHTML += noticiaHTML;
                });
            })
            .catch(error => console.error("Error cargando noticias:", error));
    }
}

// Cargar galería dinámica
function cargarGaleria() {
    const sliderContainer = document.getElementById("slider");

    if (sliderContainer) {
        fetch("data/galeria.json")
            .then(response => {
                if (!response.ok) throw new Error("Error al cargar el archivo JSON de galería");
                return response.json();
            })
            .then(data => {
                sliderContainer.innerHTML = "";
                data.forEach(item => {
                    const slide = document.createElement("div");
                    slide.classList.add("slide");
                    slide.innerHTML = `
                        <img src="${item.url}" alt="${item.titulo}">
                        <div class="info">
                            <h3>${item.titulo}</h3>
                            <p>${item.descripcion}</p>
                        </div>`;
                    sliderContainer.appendChild(slide);
                });
                inicializarCarrusel();
            })
            .catch(error => console.error("Error cargando galería:", error));
    }
}

// Inicializar carrusel
function inicializarCarrusel() {
    const sliderWrapper = document.querySelector("#slider");
    const leftArrow = document.querySelector(".arrow.left");
    const rightArrow = document.querySelector(".arrow.right");

    let currentPosition = 0;
    const itemsPerView = 2;
    let itemWidth = sliderWrapper?.children[0]?.offsetWidth || 0;

    function updateCarruselPosition() {
        sliderWrapper.style.transform = `translateX(-${currentPosition * itemWidth}px)`;
    }

    function toggleArrows() {
        const totalItems = sliderWrapper.children.length;
        leftArrow.disabled = currentPosition === 0;
        rightArrow.disabled = currentPosition >= totalItems - itemsPerView;
    }

    leftArrow.addEventListener("click", () => {
        if (currentPosition > 0) {
            currentPosition--;
            updateCarruselPosition();
            toggleArrows();
        }
    });

    rightArrow.addEventListener("click", () => {
        const totalItems = sliderWrapper.children.length;
        if (currentPosition < totalItems - itemsPerView) {
            currentPosition++;
            updateCarruselPosition();
            toggleArrows();
        }
    });

    window.addEventListener("resize", () => {
        itemWidth = sliderWrapper?.children[0]?.offsetWidth || 0;
        updateCarruselPosition();
    });

    toggleArrows();
}

// FORMULARIO DE PRESUPUESTO
window.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formPresupuesto");

    if (form) {
        const nombre = document.getElementById("nombre");
        const apellidos = document.getElementById("apellidos");
        const telefono = document.getElementById("telefono");
        const email = document.getElementById("email");
        const producto = document.getElementById("producto");
        const plazo = document.getElementById("plazo");
        const extras = document.querySelectorAll("input[name='extra']");
        const presupuestoTotal = document.getElementById("presupuestoTotal");
        const condiciones = document.getElementById("condiciones");

        // Validar campos de contacto
        function validarContacto() {
            const errores = [];
            const regexNombre = /^[A-Za-z\s]+$/;
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!regexNombre.test(nombre.value) || nombre.value.length > 15) {
                errores.push("El nombre debe tener solo letras y un máximo de 15 caracteres.");
            }

            if (!regexNombre.test(apellidos.value) || apellidos.value.length > 40) {
                errores.push("Los apellidos deben tener solo letras y un máximo de 40 caracteres.");
            }

            if (!/^\d{9}$/.test(telefono.value)) {
                errores.push("El teléfono debe tener exactamente 9 dígitos.");
            }

            if (!regexEmail.test(email.value)) {
                errores.push("El correo electrónico no es válido.");
            }

            return errores;
        }

        // Calcular presupuesto
        function calcularPresupuesto() {
            let total = parseFloat(producto.value) || 0;

            extras.forEach(extra => {
                if (extra.checked) {
                    total += parseFloat(extra.value) || 0;
                }
            });

            const descuento = parseInt(plazo.value) > 6 ? total * 0.1 : 0;
            total -= descuento;

            presupuestoTotal.textContent = `${total.toFixed(2)}€`;
        }

        // Resetear el formulario y presupuesto
        form.addEventListener("reset", () => {
            // Restablece el texto del presupuesto total
            presupuestoTotal.textContent = "0€";
        });

        // Enviar el formulario
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const errores = validarContacto();
            if (errores.length > 0) {
                alert("Errores en el formulario:\n" + errores.join("\n"));
                return;
            }

            if (!condiciones.checked) {
                alert("Debe aceptar las condiciones para enviar el formulario.");
                return;
            }

            alert("¡Formulario enviado con éxito!");
        });

        // Recalcular presupuesto en tiempo real
        form.addEventListener("input", calcularPresupuesto);

        // Calcular presupuesto inicial al cargar la página
        calcularPresupuesto();
    }
});


// Menú desplegable para móviles
function inicializarMenuDesplegable() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }
}

// Cargar productos de la tienda
function cargarProductos() {
    const productSlider = document.getElementById("product-slider");
    const leftArrow = document.querySelector(".product-slider .arrow.left");
    const rightArrow = document.querySelector(".product-slider .arrow.right");

    let currentIndex = 0;
    const productsToShow = 2;

    fetch("data/tienda.json")
        .then(response => response.json())
        .then(productos => {
            productSlider.innerHTML = "";
            productos.forEach(producto => {
                const productItem = document.createElement("div");
                productItem.className = "product-item";
                productItem.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.titulo}">
                    <h3>${producto.titulo}</h3>
                    <p>${producto.descripcion}</p>
                    <p><strong>${producto.precio}</strong></p>`;
                productSlider.appendChild(productItem);
            });

            function renderProducts() {
                const visibleProducts = productos.slice(currentIndex, currentIndex + productsToShow);
                productSlider.innerHTML = "";

                visibleProducts.forEach(producto => {
                    const productItem = document.createElement("div");
                    productItem.className = "product-item";
                    productItem.innerHTML = `
                        <img src="${producto.imagen}" alt="${producto.titulo}">
                        <h3>${producto.titulo}</h3>`;
                    productSlider.appendChild(productItem);
                });
            }

            leftArrow.addEventListener("click", () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    renderProducts();
                }
            });

            rightArrow.addEventListener("click", () => {
                if (currentIndex < productos.length - productsToShow) {
                    currentIndex++;
                    renderProducts();
                }
            });

            renderProducts();
        })
        .catch(error => console.error("Error cargando productos:", error));
}
// ✅ Selección de los elementos de scroll
const scrollUpButton = document.getElementById("scroll-up");
const scrollDownButton = document.getElementById("scroll-down");

// ✅ Scroll hacia arriba
scrollUpButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ✅ Scroll hacia abajo
scrollDownButton.addEventListener("click", () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
});

// ✅ Mostrar u ocultar las flechas basándose en la posición de la página
window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        scrollUpButton.style.display = "block";
    } else {
        scrollUpButton.style.display = "none";
    }

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        scrollDownButton.style.display = "none";
    } else {
        scrollDownButton.style.display = "block";
    }
});

