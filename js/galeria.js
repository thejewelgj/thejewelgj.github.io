
document.addEventListener("DOMContentLoaded", () => {
    const galeriaContainer = document.getElementById("galeria-container");

    // Cargar datos desde galeria.json
    fetch("../data/galeria.json")
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar el archivo JSON");
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                const galeriaItem = document.createElement("div");
                galeriaItem.classList.add("galeria-item");
                galeriaItem.innerHTML = `
                    <a href="${item.historia}" target="_blank">
                        <img src="${item.url}" alt="${item.titulo}">
                    </a>
                    <h3>${item.titulo}</h3>
                    <p>${item.descripcion}</p>
                `;
                galeriaContainer.appendChild(galeriaItem);
            });
        })
        .catch(error => console.error("Error cargando la galería:", error));
});
