const contenedor = document.querySelector("#miCarrusel .carousel-inner");
const indicadores = document.querySelector("#miCarrusel .carousel-indicators");
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

if (contenedor && indicadores) {
    proyectosCarrusel.forEach((item, i) => {
        contenedor.innerHTML += `
            <div class="carousel-item ${i === 0 ? "active" : ""}">
                <div class="mi-slide">

                    <div class="mi-img-container">
                        <img src="${item.img}" class="mi-img" alt="${item.titulo}">
                        <img src="${item.imgSecundaria || item.img}" class="mi-img mi-img-secondary" alt="${item.titulo} - vista 2">
                    </div>

                    <div class="mi-info">
                        <h3>${item.titulo}</h3>
                        <p>${item.resumen}</p>
                        ${item.tecnologias ? `<p class="mi-tecnologias">Tecnologias: ${item.tecnologias}</p>` : ""}
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
