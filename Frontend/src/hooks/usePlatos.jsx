import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
const API = import.meta.env.VITE_API_URL;

// Función para capitalizar la primera letra
const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export function usePlatos() {
  const { usuario, token } = useContext(AuthContext);
  const [platos, setPlatos] = useState([]);
  const [categoriasUnicas, setCategoriasUnicas] = useState([]);
  const [form, setForm] = useState({ nombre: "", precio: "", disponible: true, contenido: [] });
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [vista, setVista] = useState("ver");
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");


  useEffect(() => {
    if (!token) return;

    const obtenerPlatos = async () => {
      try {
        const res = await fetch(`${API}/api/platos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const filtrados = data.filter(p => p.empresa._id === usuario.empresa._id);
        setPlatos(filtrados);

        const cats = new Set();
        filtrados.forEach(plato =>
          plato.contenido.forEach(c => cats.add(capitalizar(c.categoria)))
        );
        setCategoriasUnicas([...cats]);
      } catch (err) {
        console.error("Error al obtener platos:", err);
      } finally {
        setCargando(false);
      }
    };

    obtenerPlatos();
    obtenerProductos();
  }, [token, usuario]);

  const obtenerProductos = async () => {
    try {
      const res = await fetch(`${API}/api/productos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const filtrados = data.filter(p => p.empresa._id === usuario.empresa._id);
      setProductos(filtrados);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };



  const agregarContenido = (objetoManual) => {
    const categoriaFinal = capitalizar(objetoManual?.categoria || categoria);
    const valorFinal = objetoManual?.valor || valor;
  
    if (!categoriaFinal || !valorFinal) return;
  
    const nuevoContenido = {
      categoria: categoriaFinal,
      valor: valorFinal,
      seleccionable: objetoManual?.seleccionable ?? true,
    };
  
    setForm(prev => ({
      ...prev,
      contenido: [...prev.contenido, nuevoContenido],
    }));
  
    if (!categoriasUnicas.includes(categoriaFinal)) {
      setCategoriasUnicas(prev => [...prev, categoriaFinal]);
    }
  
    if (!objetoManual) {
      setValor(""); // solo limpiamos si se usó el input
    }
  };
  

  // NUEVA función para eliminar sin enviar al backend aún
  const marcarContenidoParaEliminar = (index) => {
    const nuevoContenido = [...form.contenido];
    nuevoContenido.splice(index, 1);
    setForm(prev => ({ ...prev, contenido: nuevoContenido }));
  };

  const handleEditar = (plato) => {
    setForm({
      nombre: plato.nombre,
      precio: plato.precio,
      disponible: plato.disponible,
      contenido: [...plato.contenido], // copia segura
    });
    setEditandoId(plato._id);
    setVista("agregar");
    setMensaje("");
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este plato?")) return;
    try {
      const res = await fetch(`${API}/api/platos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setPlatos(platos.filter(p => p._id !== id));
    } catch {
      alert("No se pudo eliminar.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editandoId ? `${API}/api/platos/${editandoId}` : `${API}/api/platos`;
    const metodo = editandoId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, empresa: usuario.empresa._id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error");

      if (editandoId) {
        setPlatos(platos.map(p => (p._id === editandoId ? data : p)));
        setMensaje("✅ Plato actualizado");
        setVista("ver")
      } else {
        setPlatos([...platos, data]);
        setMensaje("✅ Plato agregado");
        setVista("ver")
      }

      setForm({ nombre: "", precio: "", disponible: "", contenido: [] });
      setEditandoId(null);
    } catch (err) {
      setMensaje("❌ Error: " + err.message);
    }
  };

  return {
    usuario,
    platos,
    cargando,
    mensaje,
    form,
    categoria,
    valor,
    vista,
    categoriasUnicas,
    editandoId,
    setCategoria,
    setValor,
    setForm,
    setVista,
    agregarContenido,
    marcarContenidoParaEliminar,
    handleEditar,
    handleEliminar,
    handleSubmit,
    productos,
    obtenerProductos,
    setBusqueda,
  };
}
