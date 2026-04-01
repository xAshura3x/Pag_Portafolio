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

function enviarForm(event){
    if (event) {
        event.preventDefault();
    }

    const formulario = event?.target?.closest("form") || document.querySelector("#formContacto");

    if (!formulario) {
        return false;
    }

    const nombreInput = formulario.querySelector('input[name="nombre"]');
    const emailInput = formulario.querySelector('input[name="email"]');
    const mensajeInput = formulario.querySelector('textarea[name="mensaje"]');

    const nombre = nombreInput ? nombreInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const mensaje = mensajeInput ? mensajeInput.value.trim() : "";

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
    formulario.reset();
    return false;
}
