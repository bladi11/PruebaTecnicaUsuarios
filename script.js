const form = document.getElementById('usuario-form');
const usuarioInput = document.getElementById('usuario-lista');
const errores = document.getElementById('errores');
const api = 'http://localhost:3001/usuarios';  // api de bd

async function cargarUsuarios() {
    const res = await fetch(api);
    const data = await res.json();
    usuarioInput.innerHTML = '';
    data.forEach(u => {
        const li = document.createElement('li');
        li.textContent = `Nombre - ${u.nombre} Correo - ${u.email} - Edad: ${u.edad} años`;
        console.log(u);
        usuarioInput.appendChild(li);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errores.textContent = '';

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const edad = parseInt(document.getElementById('edad').value);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!nombre || !email || !emailRegex.test(email) || isNaN(edad) || edad <1 ) {
        errores.textContent = 'Por favor, completa todos los campos correctamente.';
        return;
    }

    try {

        const resUsuarios = await fetch(api);
        const usuarios = await resUsuarios.json();
        const nextId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;

        const res = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: nextId, nombre, email, edad })
        });

        if (!res.ok) {
            throw new Error('Error al agregar el usuario');
        }

        form.reset();
        cargarUsuarios();
    } catch (error) {
        errores.textContent = "Error: ${error.message}";
    }
});

// Cargar usuarios
cargarUsuarios();
