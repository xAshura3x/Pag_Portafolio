const Imagenes = [
    {
        img: "../public/Img_prueba1.webp",
        titulo: "Prueba1",
        texto: "prueba1"
    },
    {
        img: "../public/Img_prueba2.jpg",
        titulo: "Prueba2",
        texto: "Prueba2"
    },
    {
        img: "../public/Img_prueba3.png",
        titulo: "Prueba3",
        texto: "Prueba3"
    }
];

const contenedor = document.querySelector("#miCarrusel .carousel-inner");
const indicadores = document.querySelector("#miCarrusel .carousel-indicators");

Imagenes.forEach((item, i) => {

    contenedor.innerHTML += `
        <div class="carousel-item ${i === 0 ? "active" : ""}">
            <div class="mi-slide">

                <div class="mi-img-container">
                    <img src="${item.img}" class="mi-img">
                </div>

                <div class="mi-info">
                    <h3>${item.titulo}</h3>
                    <p>${item.texto}</p>
                </div>

            </div>
        </div>
    `;

    indicadores.innerHTML += `
        <button type="button"
            data-bs-target="#miCarrusel"
            data-bs-slide-to="${i}"
            class="${i === 0 ? "active" : ""}">
        </button>
    `;
});

function enviarForm(){
    alert("Mensaje enviado (simulacion)");
    return false;
}