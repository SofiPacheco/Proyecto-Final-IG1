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