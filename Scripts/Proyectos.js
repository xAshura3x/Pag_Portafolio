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
    });
}
