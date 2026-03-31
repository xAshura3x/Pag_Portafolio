const contenedor = document.querySelector("#miCarrusel .carousel-inner");
const indicadores = document.querySelector("#miCarrusel .carousel-indicators");
const proyectosDisponibles = typeof proyectos !== "undefined" && Array.isArray(proyectos)
    ? proyectos
    : [];
const listaProyectos = proyectosDisponibles.filter((item) => item.destacado);
const proyectosCarrusel = listaProyectos.length > 0 ? listaProyectos : proyectosDisponibles;

if (contenedor && indicadores) {
    proyectosCarrusel.forEach((item, i) => {
        contenedor.innerHTML += `
            <div class="carousel-item ${i === 0 ? "active" : ""}">
                <div class="mi-slide">

                    <div class="mi-img-container">
                        <img src="${item.img}" class="mi-img" alt="${item.titulo}">
                    </div>

                    <div class="mi-info">
                        <h3>${item.titulo}</h3>
                        <p>${item.resumen}</p>
                    </div>

                </div>
            </div>
        `;

        indicadores.innerHTML += `
            <button type="button"
                data-bs-target="#miCarrusel"
                data-bs-slide-to="${i}"
                class="${i === 0 ? "active" : ""}"
                aria-label="Proyecto ${i + 1}">
            </button>
        `;
    });
}

function enviarForm(){
    const nombre = document.querySelector('input[type="text"]').value.trim();
    const email = document.querySelector('input[type="email"]').value.trim();
    const mensaje = document.querySelector('textarea').value.trim();

    if (!nombre || !email || !mensaje) {
        alert("Por favor, completa todos los campos.");
        return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Por favor, ingresa un email válido.");
        return false;
    }

    alert("Mensaje enviado (simulación)");
    // Aquí podrías agregar código para enviar el formulario realmente
    return false;
}
