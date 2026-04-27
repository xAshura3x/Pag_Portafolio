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

// Carrusel de 3 tarjetas
let carruselIndex = 0;
let primeraVez = true;
let animandoCarrusel = false;
let ultimaDireccionCarrusel = 1;
const CARRUSEL_TRANSITION_MS = 680;
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

function esModoMovilCarrusel() {
    return window.matchMedia(CARRUSEL_MOBILE_MEDIA_QUERY).matches;
}

function construirTarjetaHtml(indiceProyecto, posicion) {
    const item = proyectosCarrusel[indiceProyecto];
    if (!item) {
        return "";
    }

    return `
        <div class="mi-tarjeta mi-tarjeta-${posicion}" data-indice="${indiceProyecto}">
            <img src="${resolverRutaImagen(item.img)}" alt="${item.titulo}" class="mi-tarjeta-img">
            <div class="mi-tarjeta-overlay">
                <h3 class="mi-tarjeta-titulo">${item.titulo}</h3>
            </div>
        </div>
    `;
}

function actualizarContenidoTarjeta(tarjeta, indiceProyecto) {
    const item = proyectosCarrusel[indiceProyecto];
    if (!tarjeta || !item) {
        return;
    }

    tarjeta.dataset.indice = String(indiceProyecto);

    const imagen = tarjeta.querySelector(".mi-tarjeta-img");
    if (imagen) {
        imagen.src = resolverRutaImagen(item.img);
        imagen.alt = item.titulo;
    }

    const titulo = tarjeta.querySelector(".mi-tarjeta-titulo");
    if (titulo) {
        titulo.textContent = item.titulo;
    }
}

function actualizarTarjetasDirecto(contenedor, indicesVisibles) {
    const posiciones = ["izquierda", "centro", "derecha"];
    let html = "";

    indicesVisibles.forEach((indiceProyecto, posicionIndex) => {
        html += construirTarjetaHtml(indiceProyecto, posiciones[posicionIndex]);
    });

    contenedor.innerHTML = html;
}

function renderTarjetaUnica(contenedor, indiceProyecto) {
    const tarjetaUnica = contenedor.querySelector(".mi-tarjeta-unica");
    const existeSoloUnaTarjeta = contenedor.querySelectorAll(".mi-tarjeta").length === 1;

    if (tarjetaUnica && existeSoloUnaTarjeta) {
        actualizarContenidoTarjeta(tarjetaUnica, indiceProyecto);
        tarjetaUnica.className = "mi-tarjeta mi-tarjeta-centro mi-tarjeta-unica";
        return;
    }

    const htmlTarjeta = construirTarjetaHtml(indiceProyecto, "centro")
        .replace("mi-tarjeta-centro", "mi-tarjeta-centro mi-tarjeta-unica");

    contenedor.innerHTML = htmlTarjeta;
}

function animarCambioTarjetas(contenedor, indicesVisibles) {
    const tarjetaIzquierda = contenedor.querySelector(".mi-tarjeta-izquierda");
    const tarjetaCentro = contenedor.querySelector(".mi-tarjeta-centro");
    const tarjetaDerecha = contenedor.querySelector(".mi-tarjeta-derecha");

    if (!tarjetaIzquierda || !tarjetaCentro || !tarjetaDerecha) {
        actualizarTarjetasDirecto(contenedor, indicesVisibles);
        animandoCarrusel = false;
        return;
    }

    const tarjetas = [tarjetaIzquierda, tarjetaCentro, tarjetaDerecha];
    const nuevasPosiciones = ultimaDireccionCarrusel > 0
        ? ["derecha", "izquierda", "centro"]
        : ["centro", "derecha", "izquierda"];

    tarjetas.forEach((tarjeta, indice) => {
        tarjeta.classList.remove("mi-tarjeta-izquierda", "mi-tarjeta-centro", "mi-tarjeta-derecha");
        tarjeta.classList.add(`mi-tarjeta-${nuevasPosiciones[indice]}`);
    });

    window.setTimeout(() => {
        actualizarContenidoTarjeta(
            contenedor.querySelector(".mi-tarjeta-izquierda"),
            indicesVisibles[0]
        );
        actualizarContenidoTarjeta(
            contenedor.querySelector(".mi-tarjeta-centro"),
            indicesVisibles[1]
        );
        actualizarContenidoTarjeta(
            contenedor.querySelector(".mi-tarjeta-derecha"),
            indicesVisibles[2]
        );

        animandoCarrusel = false;
    }, CARRUSEL_TRANSITION_MS);
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

            if (nuevoIndice !== carruselIndex) {
                ultimaDireccionCarrusel = nuevoIndice > carruselIndex ? 1 : -1;
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

    if (animandoCarrusel) {
        return;
    }

    if (esModoMovilCarrusel()) {
        renderTarjetaUnica(contenedor, carruselIndex);
        primeraVez = false;
        actualizarIndicadores(indicadores);
        return;
    }

    const indicesVisibles = obtenerIndicesVisibles(carruselIndex);
    const tarjetasActuales = contenedor.querySelectorAll(".mi-tarjeta");
    const puedeAnimar = animar && !primeraVez && tarjetasActuales.length === 3;

    if (!puedeAnimar) {
        actualizarTarjetasDirecto(contenedor, indicesVisibles);
        primeraVez = false;
    } else {
        animandoCarrusel = true;
        animarCambioTarjetas(contenedor, indicesVisibles);
    }

    actualizarIndicadores(indicadores);
}

function siguienteTarjeta() {
    ultimaDireccionCarrusel = 1;
    carruselIndex = normalizarIndiceCarrusel(carruselIndex + 1);
    renderCarrusel(true);
}

function tarjetaAnterior() {
    ultimaDireccionCarrusel = -1;
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

