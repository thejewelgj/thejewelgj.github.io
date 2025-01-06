document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map').setView([40.416775, -3.703790], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.marker([40.416775, -3.703790]).addTo(map);
    marker.bindPopup("<b>Refugio de Animales</b><br>Calle Ejemplo 123").openPopup();
});
