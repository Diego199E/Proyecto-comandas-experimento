import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
const API = import.meta.env.VITE_API_URL;

export default function Usuarios() {
  const { usuario, token } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const [form, setForm] = useState({ nombre: "", apellido: "", correo: "", nuevaContraseña: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [confirmarContraseñaAdmin, setConfirmarContraseñaAdmin] = useState("");

  useEffect(() => {
    if (!token) return;

    const obtenerUsuarios = async () => {
      try {
        const res = await fetch(`${API}/api/usuarios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const filtrados = data.filter((u) => u.empresa._id === usuario.empresa._id);
        setUsuarios(filtrados);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuarios();
  }, [token, usuario]);

  const handleEditar = (u) => {
    setForm({
      nombre: u.nombre,
      apellido: u.apellido,
      correo: u.correo,
      nuevaContraseña: "",
    });
    setEditandoId(u._id);
    setMensaje("");
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      const res = await fetch(`${API}/api/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setUsuarios(usuarios.filter((u) => u._id !== id));
    } catch {
      alert("No se pudo eliminar.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar contraseña del admin antes de cambiar contraseña de otro usuario
    if (form.nuevaContraseña && !confirmarContraseñaAdmin) {
      setMensaje("❌ Debes confirmar tu contraseña para cambiar la contraseña del usuario.");
      return;
    }

    try {
      const res = await fetch(`${API}/api/usuarios/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          correo: form.correo,
          nuevaContraseña: form.nuevaContraseña,
          confirmarContraseñaAdmin,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error al actualizar");

      setUsuarios(usuarios.map((u) => (u._id === editandoId ? data : u)));
      setMensaje("✅ Usuario actualizado");
      setEditandoId(null);
      setForm({ nombre: "", apellido: "", correo: "", nuevaContraseña: "" });
      setConfirmarContraseñaAdmin("");
    } catch (err) {
      setMensaje("❌ Error: " + err.message);
    }
  };

  if (cargando) return <p className="p-4">Cargando usuarios...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Usuarios registrados</h2>

      {mensaje && <p className="text-sm mb-4 text-blue-600">{mensaje}</p>}

      {usuarios.length === 0 ? (
        <p>No hay usuarios registrados para tu empresa.</p>
      ) : (
        <div className="overflow-x-auto mb-6">
          <table className="w-full border text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Correo</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u._id}>
                  <td className="p-2 border">{u.nombre} {u.apellido}</td>
                  <td className="p-2 border">{u.correo}</td>
                  <td className="p-2 border space-x-2 text-center">
                    <button
                      onClick={() => handleEditar(u)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Editar
                    </button>

                    {/* Ocultar eliminar si es admin o el usuario actual */}
                    {(u.rol !== "admin" && u._id !== usuario._id) ? (
                      <button
                        onClick={() => handleEliminar(u._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Eliminar
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">Protegido</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editandoId && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold">Editar usuario</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="border px-4 py-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={form.apellido}
              onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              className="border px-4 py-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Correo"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              className="border px-4 py-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Nueva contraseña (opcional)"
              value={form.nuevaContraseña}
              onChange={(e) => setForm({ ...form, nuevaContraseña: e.target.value })}
              className="border px-4 py-2 rounded"
            />
            {form.nuevaContraseña && (
              <input
                type="password"
                placeholder="Tu contraseña de admin"
                value={confirmarContraseñaAdmin}
                onChange={(e) => setConfirmarContraseñaAdmin(e.target.value)}
                className="border px-4 py-2 rounded"
                required
              />
            )}
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          >
            Guardar cambios
          </button>
        </form>
      )}
    </div>
  );
}
