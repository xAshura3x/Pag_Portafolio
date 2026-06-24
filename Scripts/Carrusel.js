const EMAILJS_CONFIG = {
    publicKey: "HI-92bgvDkJBix5R1",
    serviceId: "service_5bphcwa",
    templateId: "template_asil4fg",
    destinatarios: ["osmarchantg@gmail.com", "bryanmunos490@gmail.com"]
};

const proyectosDisponibles = typeof proyectos !== "undefined" && Array.isArray(proyectos)
    ? proyectos
    : [];
const listaProyectos = proyectosDisponibles.filter((item) => item.destacado);
const proyectosCarrusel = listaProyectos.length > 0 ? listaProyectos : proyectosDisponibles;

function resolverRutaImagen(ruta) {
    if (typeof ruta !== "string") {
        return "";
    }

    const rutaNormalizada = ruta.replace(/\\/g, "/").trim();
    if (!rutaNormalizada) {
        return "";
    }

    if (/^(https?:)?\/\//i.test(rutaNormalizada) || rutaNormalizada.startsWith("data:")) {
        return rutaNormalizada;
    }

    const paginaEnCarpetaHtml = /\/html\//i.test(window.location.pathname.replace(/\\/g, "/"));
    if (paginaEnCarpetaHtml) {
        return rutaNormalizada;
    }

    return rutaNormalizada.replace(/^(\.\.\/)+/, "");
}

// Carrusel estilo Steam
let carruselIndex = 0;
const CARRUSEL_SWIPE_MIN_PX = 50;
const CARRUSEL_MOBILE_MEDIA_QUERY = "(max-width: 768px)";
let carruselTouchStartX = null;
let carruselTouchStartY = null;

function normalizarIndiceCarrusel(indice) {
    const total = proyectosCarrusel.length;
    if (!total) {
        return 0;
    }

    return ((indice % total) + total) % total;
}

function obtenerIndicesVisibles(baseIndex) {
    return [
        normalizarIndiceCarrusel(baseIndex - 1),
        normalizarIndiceCarrusel(baseIndex),
        normalizarIndiceCarrusel(baseIndex + 1)
    ];
}

function obtenerImagenesProyecto(item) {
    return [item.img, item.imgSecundaria].filter((ruta) => typeof ruta === "string" && ruta.trim());
}

function escaparHtml(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function esModoMovilCarrusel() {
    return window.matchMedia(CARRUSEL_MOBILE_MEDIA_QUERY).matches;
}

function construirPreviewHtml(indiceProyecto, posicion) {
    const item = proyectosCarrusel[indiceProyecto];
    if (!item) {
        return "";
    }

    return `
        <button class="mi-tarjeta mi-tarjeta-${posicion}" type="button" data-indice="${indiceProyecto}" aria-label="Ver ${escaparHtml(item.titulo)}">
            <img src="${resolverRutaImagen(item.img)}" alt="" class="mi-tarjeta-img">
            <div class="mi-tarjeta-overlay" aria-hidden="true">
                <h3 class="mi-tarjeta-titulo">${escaparHtml(item.titulo)}</h3>
            </div>
        </button>
    `;
}

function construirProyectoDestacadoHtml(indiceProyecto) {
    const item = proyectosCarrusel[indiceProyecto];
    if (!item) {
        return "";
    }

    const imagenes = obtenerImagenesProyecto(item);
    const imagenPrincipal = imagenes[0] || "";
    const miniaturas = imagenes.slice(0, 4);
    const tecnologias = item.tecnologias ? `<p class="mi-steam-tech">${escaparHtml(item.tecnologias)}</p>` : "";

    return `
        <article class="mi-steam-card" data-indice="${indiceProyecto}">
            <div class="mi-steam-media">
                <img src="${resolverRutaImagen(imagenPrincipal)}" alt="${escaparHtml(item.titulo)}" class="mi-steam-main-img">
            </div>
            <div class="mi-steam-info">
                <div>
                    <span class="mi-steam-label">Proyecto destacado</span>
                    <h3>${escaparHtml(item.titulo)}</h3>
                    <p class="mi-steam-description">${escaparHtml(item.resumen || item.descripcion || "")}</p>
                    ${tecnologias}
                </div>
                <div class="mi-steam-thumbs" aria-label="Vistas del proyecto">
                    ${miniaturas.map((ruta, indice) => `
                        <img src="${resolverRutaImagen(ruta)}" alt="${escaparHtml(item.titulo)} vista ${indice + 1}">
                    `).join("")}
                </div>
            </div>
        </article>
    `;
}

function actualizarTarjetasDirecto(contenedor, indicesVisibles) {
    contenedor.innerHTML = `
        ${construirPreviewHtml(indicesVisibles[0], "izquierda")}
        ${construirProyectoDestacadoHtml(indicesVisibles[1])}
        ${construirPreviewHtml(indicesVisibles[2], "derecha")}
    `;
    configurarClicksPreviews(contenedor);
}

function renderTarjetaUnica(contenedor, indiceProyecto) {
    contenedor.innerHTML = construirProyectoDestacadoHtml(indiceProyecto);
}

function configurarClicksPreviews(contenedor) {
    contenedor.querySelectorAll(".mi-tarjeta").forEach((tarjeta) => {
        tarjeta.addEventListener("click", (event) => {
            const nuevoIndice = Number.parseInt(event.currentTarget.dataset.indice, 10);
            if (Number.isNaN(nuevoIndice) || nuevoIndice === carruselIndex) {
                return;
            }

            carruselIndex = nuevoIndice;
            renderCarrusel(true);
            reiniciarAutoRotar();
        });
    });
}

function actualizarIndicadores(indicadores) {
    if (!indicadores) {
        return;
    }

    let indicatoresHtml = "";
    for (let i = 0; i < proyectosCarrusel.length; i++) {
        indicatoresHtml += `
            <button type="button" 
                class="carousel-indicator-dot ${i === carruselIndex ? "active" : ""}"
                data-index="${i}"
                aria-label="Proyecto ${i + 1}">
            </button>
        `;
    }

    indicadores.innerHTML = indicatoresHtml;

    document.querySelectorAll(".carousel-indicator-dot").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const nuevoIndice = Number.parseInt(e.currentTarget.dataset.index, 10);
            if (Number.isNaN(nuevoIndice)) {
                return;
            }

            carruselIndex = nuevoIndice;
            renderCarrusel(!esModoMovilCarrusel());
            reiniciarAutoRotar();
        });
    });
}

function renderCarrusel(animar = true) {
    const contenedor = document.querySelector("#miCarrusel .carousel-inner");
    const indicadores = document.querySelector(".carousel-indicators");

    if (!contenedor || proyectosCarrusel.length === 0) {
        return;
    }

    if (esModoMovilCarrusel()) {
        renderTarjetaUnica(contenedor, carruselIndex);
        actualizarIndicadores(indicadores);
        return;
    }

    const indicesVisibles = obtenerIndicesVisibles(carruselIndex);
    actualizarTarjetasDirecto(contenedor, indicesVisibles);

    actualizarIndicadores(indicadores);
}

function siguienteTarjeta() {
    carruselIndex = normalizarIndiceCarrusel(carruselIndex + 1);
    renderCarrusel(true);
}

function tarjetaAnterior() {
    carruselIndex = normalizarIndiceCarrusel(carruselIndex - 1);
    renderCarrusel(true);
}

// Inicializar carrusel
renderCarrusel();

// Auto-rotación cada 10 segundos
let autoRotarInterval;

function iniciarAutoRotar() {
    autoRotarInterval = setInterval(() => {
        siguienteTarjeta();
    }, 10000);
}

function detenerAutoRotar() {
    clearInterval(autoRotarInterval);
}

function reiniciarAutoRotar() {
    detenerAutoRotar();
    iniciarAutoRotar();
}

iniciarAutoRotar();

// Event listeners para navegación
document.querySelector(".mi-carrusel-prev")?.addEventListener("click", () => {
    tarjetaAnterior();
    reiniciarAutoRotar();
});

document.querySelector(".mi-carrusel-next")?.addEventListener("click", () => {
    siguienteTarjeta();
    reiniciarAutoRotar();
});

function configurarSwipeCarrusel() {
    const carrusel = document.querySelector("#miCarrusel");
    if (!carrusel) {
        return;
    }

    carrusel.addEventListener(
        "touchstart",
        (event) => {
            const toque = event.changedTouches[0];
            carruselTouchStartX = toque.clientX;
            carruselTouchStartY = toque.clientY;
        },
        { passive: true }
    );

    carrusel.addEventListener(
        "touchend",
        (event) => {
            if (carruselTouchStartX === null || carruselTouchStartY === null || !esModoMovilCarrusel()) {
                carruselTouchStartX = null;
                carruselTouchStartY = null;
                return;
            }

            const toqueFinal = event.changedTouches[0];
            const deltaX = toqueFinal.clientX - carruselTouchStartX;
            const deltaY = toqueFinal.clientY - carruselTouchStartY;

            carruselTouchStartX = null;
            carruselTouchStartY = null;

            if (Math.abs(deltaX) < CARRUSEL_SWIPE_MIN_PX || Math.abs(deltaX) <= Math.abs(deltaY)) {
                return;
            }

            if (deltaX < 0) {
                siguienteTarjeta();
            } else {
                tarjetaAnterior();
            }

            reiniciarAutoRotar();
        },
        { passive: true }
    );
}

configurarSwipeCarrusel();
window.addEventListener("resize", () => renderCarrusel(false));

function emailJsNoConfigurado() {
    return (
        EMAILJS_CONFIG.publicKey.startsWith("REEMPLAZAR_") ||
        EMAILJS_CONFIG.serviceId.startsWith("REEMPLAZAR_") ||
        EMAILJS_CONFIG.templateId.startsWith("REEMPLAZAR_")
    );
}

function obtenerFechaEnvio() {
    return new Date().toLocaleString("es-CL", {
        timeZone: "America/Santiago",
        hour12: false
    });
}

async function enviarForm(event){
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

    if (emailJsNoConfigurado()) {
        alert("Configura PUBLIC_KEY, SERVICE_ID y TEMPLATE_ID de EmailJS en Scripts/Carrusel.js.");
        return false;
    }

    if (typeof emailjs === "undefined") {
        alert("No se cargó la librería de EmailJS.");
        return false;
    }

    const submitBtn = formulario.querySelector('button[type="submit"]');
    const textoOriginal = submitBtn ? submitBtn.textContent : "Enviar";

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";
    }

    const templateParams = {
        to_email: EMAILJS_CONFIG.destinatarios.join(", "),
        from_name: nombre,
        from_email: email,
        reply_to: email,
        message: mensaje,
        nombre,
        email,
        solicitante_nombre: nombre,
        solicitante_email: email,
        mensaje,
        datos_solicitud: `Nombre: ${nombre}\nCorreo: ${email}\nMensaje: ${mensaje}`,
        fecha_envio: obtenerFechaEnvio(),
        subject: "Nuevo mensaje desde el formulario de contacto"
    };

    try {
        emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });

        await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );

        alert("Mensaje enviado correctamente.");
        formulario.reset();

        const modalEl = document.querySelector("#modalContacto");
        if (modalEl && typeof bootstrap !== "undefined") {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) {
                modal.hide();
            }
        }
    } catch (error) {
        console.error("Error al enviar con EmailJS:", error);
        alert("No se pudo enviar el mensaje. Inténtalo nuevamente.");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = textoOriginal;
        }
    }

    return false;
}
