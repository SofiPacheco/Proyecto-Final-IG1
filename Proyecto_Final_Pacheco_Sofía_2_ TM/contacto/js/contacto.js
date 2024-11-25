   // Función flecha para validar el campo "Nombre"
const validarNombre = () => {
    const nombre = document.getElementById('nombre'); // Obtenemos el valor del campo NOMBRE Y eliminamos los espacios del inicio y el final con el método .trim() que quita los espacios en blanco antes y después del texto.
    const nombreValue = nombre.value.trim();
    const nombreError = document.getElementById('nombreError'); // Obtiene el elemento del DOM con el id 'nombreError', donde se mostrará el mensaje de error si el nombre no es válido
    const nombreCorrecto = document.getElementById('nombreCorrecto'); //idem si cumple con los requerimientos
    
    // si el valor del nombre está vacío
    if (!nombreValue) {
        nombreError.textContent = 'Por favor, ingresá tu nombre'; //mensaje de error
        nombreError.style.display = 'block'  // Hace visible el mensaje de error
        nombreCorrecto.style.display = 'none';  // Oculta el mensaje de validación
        nombre.classList.add('is-invalid'); // .add() agrega una clase CSS al elemento. 'is-invalid' clase que pone las letras en rojo por el error
        } 
    //  Si el nombre contiene caracteres no válidos (números, caracteres especiales, etc.)
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(nombreValue)) { //carácteres permitidos. .test comprueba si el texto cumple con las reglas
        nombreError.textContent = 'Por favor, ingrese un nombre válido. *Sin números'; //sino, salen mensajes de error
        nombreError.style.display = 'block'; // visibiliza el mensaje de error
        nombreCorrecto.style.display = 'none'; // oculta mensaje de validación
        nombre.classList.add('is-invalid'); //idem
    } 
    // si está validado
    else {
        nombreError.style.display = 'none';  // oculta mensaje de error
        nombreCorrecto.style.display = 'block'; //visibiliza mensaje de validación
        nombre.classList.remove('is-invalid'); //elimina la clase is-invalid (color rojo)
        nombre.classList.add('is-valid'); //se agrega la clase is-valir (verde)
    } 
};

// Función para validar el campo "Correo"
const validarCorreo = () => {
    // Obtiene el elemento del DOM con el id 'correo', que corresponde al campo donde el usuario ingresa su correo electrónico
    const correo = document.getElementById('correo');
    // Obtiene el valor del campo, eliminando espacios al inicio y al final con el método .trim()
    const correoValue = correo.value.trim(); // .trim() elimina espacios adicionales
    // Obtiene el elemento del DOM con el id 'correoError', donde se mostrará el mensaje de error del correo
    const correoError = document.getElementById('correoError');
    // Obtiene el elemento del DOM con el id 'correoCorrecto', donde se mostrará el mensaje de validación exitosa del correo
    const correoCorrecto = document.getElementById('correoCorrecto');

    // si el campo está vacío
    if (!correoValue) {
        correoError.textContent = 'Por favor, ingresá tu mail'; //muestra em mensaje
        correoError.style.display = 'block'; //visible mensaje de error
        correoCorrecto.style.display = 'none'; //oculta mensaje de validación
        correo.classList.add('is-invalid');
    } 

    else if (!correoValue.includes('@')) { //verifica si la cadena incluye el @
        correoError.textContent = 'Por favor, ingresá un correo electrónico válido que incluya "@"'; // si no lo incluye
        correoError.style.display = 'block';
        correoCorrecto.style.display = 'none';
        correo.classList.add('is-invalid');
    } 
    // si el correo pestá validado
    else {
        correoError.style.display = 'none'; //oculta error
        correoCorrecto.style.display = 'block'; //mensaje de validación
        correo.classList.remove('is-invalid'); //elimina la clase invalid, visibiliza el valid...
        correo.classList.add('is-valid');
    }
};

// Función para validar el campo "Asunto"
const validarAsunto = () => {
    const asunto = document.getElementById('asunto');
    const asuntoValue = asunto.value.trim();
    const asuntoError = document.getElementById('asuntoError');

    //  si el campo de asunto está vacío
    if (!asuntoValue) {
        asuntoError.textContent = 'Por favor, ingresa el asunto';
        asuntoError.style.display = 'block'; ///visible mensaje d error
        asunto.classList.add('is-invalid');
    } else {
        asuntoError.style.display = 'none';
        asunto.classList.remove('is-invalid');
        asunto.classList.add('is-valid');
    }
};

// validar el campo "Mensaje"
const validarMensaje = () => {
    const mensaje = document.getElementById('mensaje'); 
    const mensajeValue = mensaje.value.trim(); 
    const mensajeError = document.getElementById('mensajeError');

    //  si el campo de mensaje está vacío
    if (!mensajeValue) {
        mensajeError.textContent = 'Por favor, escribe tu mensaje';
        mensajeError.style.display = 'block'; 
        mensaje.classList.add('is-invalid'); 
    } else { //si no está vacío
        mensajeError.style.display = 'none'; 
        mensaje.classList.remove('is-invalid'); 
        mensaje.classList.add('is-valid');
    }
};

// Agrega un evento 'input' para cada campo, que ejecuta la función correspondiente cuando el usuario escribe
document.getElementById('nombre').addEventListener('input', validarNombre);
document.getElementById('correo').addEventListener('input', validarCorreo);
document.getElementById('asunto').addEventListener('input', validarAsunto);
document.getElementById('mensaje').addEventListener('input', validarMensaje);

// Validación completa del formulario al intentar enviarlo
document.getElementById('formularioContacto').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente
    document.getElementById('mensajeErrorGlobal').style.display = 'none'; // Limpia errores globales
    
    // Valida cada campo individualmente
    validarNombre();
    validarCorreo();
    validarAsunto();
    validarMensaje();

    // Verifica si hay campos con errores
    const camposInvalidos = document.querySelectorAll('.is-invalid'); // Busca elementos con la clase 'is-invalid'
    if (camposInvalidos.length === 0) {
        document.getElementById('mensajeRespuesta').style.display = 'block'; // Si es válido, muestra un mensaje de éxito por 5 segundos
        setTimeout(() => {
            document.getElementById('mensajeRespuesta').style.display = 'none';
        }, 5000); // Oculta el mensaje después de 5 segundos
    } else {
        // Si hay errores, muestra un mensaje global de error
        document.getElementById('mensajeErrorGlobal').style.display = 'block';
    }
});
