const contenedorCatalogo = document.querySelector("#catalogoProyectos");
const modalTitulo = document.querySelector("#proyectoModalTitulo");
const modalImagen = document.querySelector("#proyectoModalImagen");
const modalDescripcion = document.querySelector("#proyectoModalDescripcion");

if (contenedorCatalogo && typeof proyectos !== "undefined" && Array.isArray(proyectos)) {
    contenedorCatalogo.innerHTML = proyectos
        .map(
            (proyecto, indice) => `
            <div class="col-12 col-sm-6 col-lg-4">
                <button type="button"
                    class="catalogo-card"
                    data-proyecto-index="${indice}"
                    data-bs-toggle="modal"
                    data-bs-target="#modalProyecto">
                    <img src="${proyecto.img}" alt="${proyecto.titulo}" class="catalogo-img">
                    <div class="catalogo-body">
                        <h3>${proyecto.titulo}</h3>
                        <p>${proyecto.resumen}</p>
                    </div>
                </button>
            </div>
        `
        )
        .join("");

    contenedorCatalogo.addEventListener("click", (evento) => {
        const tarjeta = evento.target.closest("[data-proyecto-index]");

        if (!tarjeta) {
            return;
        }

        const indice = Number(tarjeta.dataset.proyectoIndex);
        const proyecto = proyectos[indice];

        if (!proyecto || !modalTitulo || !modalImagen || !modalDescripcion) {
            return;
        }

        modalTitulo.textContent = proyecto.titulo;
        modalImagen.src = proyecto.img;
        modalImagen.alt = proyecto.titulo;
        modalDescripcion.textContent = proyecto.descripcion;

        // Obtener la URL del proyecto
        const enlaceDemo = proyecto.linkDemo || proyecto.link || proyecto.url || "";

        // --- Hacer que la imagen sea interactiva y redireccione ---
        if (enlaceDemo) {
            modalImagen.style.cursor = "pointer";
            modalImagen.title = "Haz clic para ver la demo en vivo";
            modalImagen.onclick = () => window.open(enlaceDemo, "_blank");
        } else {
            modalImagen.style.cursor = "default";
            modalImagen.title = "";
            modalImagen.onclick = null;
        }

        // --- Insertar o limpiar el botón de Demo en el modal ---
        let contenedorBoton = document.querySelector("#proyectoModalLinkContainer");

            if (!contenedorBoton) {
                contenedorBoton = document.createElement("div");
                contenedorBoton.id = "proyectoModalLinkContainer";
                
                // Forzamos el centrado directamente con CSS Flexbox
                contenedorBoton.style.display = "flex";
                contenedorBoton.style.justifyContent = "center";
                contenedorBoton.style.width = "100%";
                contenedorBoton.style.marginTop = "1.5rem";
                
                modalDescripcion.parentNode.appendChild(contenedorBoton);
            } else {
                // Si ya existía, también le aseguramos el estilo centrado
                contenedorBoton.style.display = "flex";
                contenedorBoton.style.justifyContent = "center";
                contenedorBoton.style.width = "100%";
            }

            if (enlaceDemo) {
                contenedorBoton.innerHTML = `
                    <a href="${enlaceDemo}" target="_blank" rel="noopener noreferrer" class="mi-btn mi-btn-primary" style="margin: 0 auto; display: inline-block;">
                        Ver Demo
                    </a>
                `;
            } else {
                contenedorBoton.innerHTML = "";
            }
                });
}