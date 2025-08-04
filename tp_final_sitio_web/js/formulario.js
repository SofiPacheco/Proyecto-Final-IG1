// Agregar este script al contacto.html
document.getElementById('formularioContacto').addEventListener('submit', function(e) {
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const asunto = document.getElementById('asunto').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    
    if (nombre === '' || correo === '' || asunto === '' || mensaje === '') {
        e.preventDefault();
        alert('Por favor, completa todos los campos.');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        e.preventDefault();
        alert('Por favor, ingresa un email válido.');
        return false;
    }
});