// === Login ===
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const correo = document.getElementById("correo").value;
        const contraseña = document.getElementById("contraseña").value;

        try {
            const res = await fetch(`${url}api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ correo, contraseña }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.mensaje || "Error al iniciar sesión");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
            alert("✅ Sesión iniciada con éxito");
            window.location.href = "admin.html"; // Cambia esto según tu página principal
        } catch (error) {
            console.error("Error:", error);
            alert("Error al conectar con el servidor");
        }
    });
}

// === Registro ===
// Ya no se muestra ni se controla el rol (por defecto será "Vendedor" en el backend)

const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const contraseña = document.getElementById("contraseña").value;

    try {
        const res = await fetch(`${url}api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token') || ""
            },
            body: JSON.stringify({ nombre, apellido, correo, contraseña }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.mensaje || "Error al registrarse");
            return;
        }

        alert("✅ Usuario registrado con éxito");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor");
    }
});


