    // Añadir el evento de envío al formulario
    document.getElementById("formularioContacto").addEventListener("submit", function(evento) {
        evento.preventDefault(); // Evita el envío del formulario

        // Obtener los valores de los campos
        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correo").value;
        const asunto = document.getElementById("asunto").value;
        const mensaje = document.getElementById("mensaje").value;

        // Validación simple
        if (nombre === "" || correo === "" || asunto === "" || mensaje === "") {
            alert("Todos los campos son obligatorios.");
            return;
        }

        // Simular el envío y mostrar el mensaje de éxito
        document.getElementById("mensajeRespuesta").style.display = "block";

        // Limpiar el formulario
        document.getElementById("formularioContacto").reset();
    });

// Encierra todo el código en una función autoinvocada para evitar conflictos de variables y asegurarse de que el código se ejecute inmediatamente.
(function () {
'use strict'; // Usa el modo estricto de JavaScript para escribir un código más seguro y evitar ciertos errores.

// Obtiene el formulario del DOM usando su ID
var form = document.getElementById('formularioContacto');

// Agrega un evento de "submit" al formulario, que se activa cuando el usuario intenta enviarlo.
form.addEventListener('submit', function (event) {
    
    // Verifica si el formulario es válido o no usando el método checkValidity() de los formularios HTML5.
    // Este método devuelve "false" si algún campo requerido no está completo o tiene errores de formato (por ejemplo, un email sin "@").
    if (!form.checkValidity()) {
        // Si el formulario no es válido, evita que se envíe.
        event.preventDefault(); // Evita que el formulario se envíe realmente.
        event.stopPropagation(); // Evita que el evento "submit" se propague, deteniendo otros posibles manejadores de eventos.
    } else {
        // Si todos los campos son válidos, también evita el envío real para mostrar un mensaje de éxito en pantalla.
        event.preventDefault(); // Evita el envío real solo para demostrar el mensaje de éxito.
        
        // Muestra el mensaje de éxito cambiando el estilo de "display" a "block".
        document.getElementById('mensajeRespuesta').style.display = 'block';
    }
    
    // Añade la clase 'was-validated' al formulario. 
    // Bootstrap usa esta clase para aplicar estilos de validación visual, mostrando los mensajes de error o éxito según corresponda.
    form.classList.add('was-validated');
    
}, false); // Define el tercer argumento como "false" para asegurarse de que el evento no se capture, sino que se maneje en la fase de burbujeo.
})();
