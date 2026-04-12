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

// Carrusel de 3 tarjetas
// Carrusel de 3 tarjetas
let carruselIndex = 0;
let primeraVez = true;
let animandoCarrusel = false;

function renderCarrusel() {
    const contenedor = document.querySelector("#miCarrusel .carousel-inner");
    const indicadores = document.querySelector(".carousel-indicators");
    
    if (!contenedor || proyectosCarrusel.length === 0) return;
    if (animandoCarrusel && !primeraVez) return; // Evitar múltiples animaciones simultáneas

    if (primeraVez) {
        // Primera carga sin animación
        actualizarTarjetasDirecto();
        primeraVez = false;
    } else {
        // Animar cambio de tarjetas
        animandoCarrusel = true;
        animarCambioTarjetas();
    }
    
    function actualizarTarjetasDirecto() {
        let html = '';
        
        for (let i = 0; i < 3; i++) {
            const index = (carruselIndex + i) % proyectosCarrusel.length;
            const item = proyectosCarrusel[index];
            const posicion = i === 0 ? 'izquierda' : i === 1 ? 'centro' : 'derecha';
            
            html += `
                <div class="mi-tarjeta mi-tarjeta-${posicion}" data-indice="${index}">
                    <img src="${item.img}" alt="${item.titulo}" class="mi-tarjeta-img">
                    <div class="mi-tarjeta-overlay">
                        <h3 class="mi-tarjeta-titulo">${item.titulo}</h3>
                    </div>
                </div>
            `;
        }
        
        contenedor.innerHTML = html;
        actualizarIndicadores();
    }
    
    function animarCambioTarjetas() {
        const tarjetasActuales = contenedor.querySelectorAll(".mi-tarjeta");
        
        // Animar salida de tarjetas actuales
        tarjetasActuales[0]?.style.animation = "none";
        tarjetasActuales[1]?.style.animation = "none";
        tarjetasActuales[2]?.style.animation = "none";
        
        // Force reflow
        contenedor.offsetHeight;
        
        tarjetasActuales[0]?.style.animation = "tarjetaSaleIzq 0.6s ease-in-out forwards";
        tarjetasActuales[1]?.style.animation = "tarjetaSaleCentro 0.6s ease-in-out forwards";
        tarjetasActuales[2]?.style.animation = "tarjetaSaleDer 0.6s ease-in-out forwards";
        
        setTimeout(() => {
            // Actualizar contenido con nuevas tarjetas
            let html = '';
            for (let i = 0; i < 3; i++) {
                const index = (carruselIndex + i) % proyectosCarrusel.length;
                const item = proyectosCarrusel[index];
                const posicion = i === 0 ? 'izquierda' : i === 1 ? 'centro' : 'derecha';
                
                html += `
                    <div class="mi-tarjeta mi-tarjeta-${posicion}" data-indice="${index}" style="animation: tarjetaEntra${posicion === 'izquierda' ? 'Izq' : posicion === 'centro' ? 'Centro' : 'Der'} 0.6s ease-in-out forwards;">
                        <img src="${item.img}" alt="${item.titulo}" class="mi-tarjeta-img">
                        <div class="mi-tarjeta-overlay">
                            <h3 class="mi-tarjeta-titulo">${item.titulo}</h3>
                        </div>
                    </div>
                `;
            }
            
            contenedor.innerHTML = html;
            actualizarIndicadores();
            
            setTimeout(() => {
                animandoCarrusel = false;
            }, 600);
        }, 300);
    }
    
    function actualizarIndicadores() {
        if (indicadores) {
            let indicatoresHtml = '';
            for (let i = 0; i < proyectosCarrusel.length; i++) {
                indicatoresHtml += `
                    <button type="button" 
                        class="carousel-indicator-dot ${i === carruselIndex ? 'active' : ''}"
                        data-index="${i}"
                        aria-label="Proyecto ${i + 1}">
                    </button>
                `;
            }
            indicadores.innerHTML = indicatoresHtml;

            document.querySelectorAll(".carousel-indicator-dot").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    carruselIndex = parseInt(e.target.dataset.index);
                    renderCarrusel();
                });
            });
        }
    }
}

function siguienteTarjeta() {
    carruselIndex = (carruselIndex + 1) % proyectosCarrusel.length;
    renderCarrusel();
}

function tarjetaAnterior() {
    carruselIndex = (carruselIndex - 1 + proyectosCarrusel.length) % proyectosCarrusel.length;
    renderCarrusel();
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

// Reiniciar al hacer click en indicadores
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("carousel-indicator-dot")) {
        reiniciarAutoRotar();
    }
});

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
