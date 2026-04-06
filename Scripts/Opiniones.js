(() => {
    const listaOpiniones = document.getElementById("opinionesLista");
    const gauge = document.getElementById("opinionesPromedioGauge");
    const valueNode = document.getElementById("opinionesPromedioValor");
    const countNode = document.getElementById("opinionesPromedioCantidad");
    const opinionesDisponibles = typeof opiniones !== "undefined" && Array.isArray(opiniones)
        ? opiniones
        : [];

    if (!listaOpiniones || !gauge || !valueNode || !countNode) return;

    const opinionesValidas = opinionesDisponibles
        .map((opinion) => {
            const nombre = String(opinion?.nombre || "").trim();
            const comentario = String(opinion?.comentario || "").trim();
            const calificacion = Number(opinion?.calificacion);

            return {
                nombre,
                comentario,
                calificacion
            };
        })
        .filter((opinion) =>
            opinion.nombre &&
            opinion.comentario &&
            Number.isFinite(opinion.calificacion) &&
            opinion.calificacion >= 0 &&
            opinion.calificacion <= 5
        );

    if (!opinionesValidas.length) {
        listaOpiniones.innerHTML = `
            <div class="col-12">
                <article class="mi-card opinion-card">
                    <div class="opinion-info">
                        <h3>Sin opiniones disponibles</h3>
                        <p class="opinion-comment">Agrega nuevas opiniones en Scripts/OpinionesData.js para mostrarlas automaticamente.</p>
                    </div>
                </article>
            </div>
        `;
        gauge.style.setProperty("--rating", "0");
        valueNode.textContent = "0.0";
        countNode.textContent = "0";
        return;
    }

    const htmlOpiniones = opinionesValidas
        .map((opinion) => {
            const score = opinion.calificacion.toFixed(1);
            return `
                <div class="col-12 mb-3">
                    <article class="mi-card opinion-card">
                        <div class="opinion-info">
                            <h3>${escapeHtml(opinion.nombre)}</h3>
                            <p class="opinion-rating">Calificacion: ${score} / 5</p>
                            <p class="opinion-comment">${escapeHtml(opinion.comentario)}</p>
                        </div>
                        <aside class="opinion-stars" aria-label="Calificacion por estrellas: ${score} de 5">
                            <span class="stars" aria-hidden="true">${buildStars(opinion.calificacion)}</span>
                            <span class="score">${score}</span>
                        </aside>
                    </article>
                </div>
            `;
        })
        .join("");

    listaOpiniones.innerHTML = htmlOpiniones;

    const average = opinionesValidas.reduce((total, opinion) => total + opinion.calificacion, 0) / opinionesValidas.length;
    const roundedAverage = Math.round(average * 10) / 10;
    const safeAverage = Math.min(5, Math.max(0, roundedAverage));
    const averageText = safeAverage.toFixed(1);

    gauge.style.setProperty("--rating", String(safeAverage));
    gauge.setAttribute("aria-label", `Promedio general de ${averageText} sobre 5`);
    valueNode.textContent = averageText;
    countNode.textContent = String(opinionesValidas.length);
})();

function buildStars(rating) {
    const fullStars = Math.max(0, Math.min(5, Math.round(rating)));
    return "&#9733;".repeat(fullStars) + "&#9734;".repeat(5 - fullStars);
}

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
