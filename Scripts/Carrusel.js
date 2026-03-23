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

let index = 0;

const Img = document.getElementById("Img_Carrusel");
const titulo = document.getElementById("Titulo_overlay");
const texto = document.getElementById("Texto_overlay");

function Cambiar_imagenes(){

    if(!Imagenes[index] || !Imagenes[index].img) return;

    Img.style.opacity = 0;

    setTimeout(() =>{
        Img.src = Imagenes[index].img;

        titulo.textContent = Imagenes[index].titulo;
        texto.textContent = Imagenes[index].texto;

        Img.style.opacity = 1;
    }, 200);
}

document.getElementById("despues").onclick = () => {
    index = (index + 1) % Imagenes.length;
    Cambiar_imagenes();
};

document.getElementById("antes").onclick = () => {
    index = (index - 1 + Imagenes.length) % Imagenes.length;
    Cambiar_imagenes();
};

setInterval(() => {
    index = (index + 1) % Imagenes.length;
    Cambiar_imagenes();
}, 4000);

function enviarForm(){
    alert("Mensaje enviado (simulacion)");
    return false;
}