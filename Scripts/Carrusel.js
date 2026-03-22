const Imagenes = [
    "../public/Img_prueba1.webp",
    "../public/Img_prueba2.jpg",
    "../public/Img_prueba3.png"
];

let index = 0;

const Img = document.getElementById("Img_Carrusel");

function Cambiar_imagenes(){

    Img.style.opacity = 0;

    setTimeout(() =>{
        Img.src = Imagenes[index];
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