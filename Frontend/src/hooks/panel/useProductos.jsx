import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";

const API = import.meta.env.VITE_API_URL;

export default function useProductos() {
  const { token } = useContext(AuthContext);

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // ✅ Obtener todos los productos al cargar
  const obtenerProductos = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/productos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje || "Error al obtener productos");

      setProductos(data);
    } catch (err) {
      console.error("❌ Error al obtener productos:", err.message);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // ✅ Crear nuevo producto
  const crearProducto = async (producto) => {
    try {
      const res = await fetch(`${API}/api/productos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(producto),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje || "Error al crear producto");

      setProductos((prev) => [...prev, data]);
    } catch (err) {
      console.error("❌ Error al crear producto:", err.message);
      setError(err.message);
    }
  };

  // ✅ Actualizar producto
  const actualizarProducto = async (id, actualizado) => {
    try {
      const res = await fetch(`${API}/api/productos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(actualizado),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje || "Error al actualizar producto");

      setProductos((prev) =>
        prev.map((p) => (p._id === id ? data : p))
      );
    } catch (err) {
      console.error("❌ Error al actualizar producto:", err.message);
      setError(err.message);
    }
  };

  // ✅ Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      const res = await fetch(`${API}/api/productos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje || "Error al eliminar producto");

      setProductos((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Error al eliminar producto:", err.message);
      setError(err.message);
    }
  };

  const fabricarProducto = async (id, cantidad) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}/fabricar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cantidad }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al fabricar producto");
      return data;
    } catch (err) {
      throw err;
    }
  };
  
  

  // ✅ Productos filtrados por búsqueda
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return {
    productos: productosFiltrados,
    cargando,
    error,
    busqueda,
    setBusqueda,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductos,
    fabricarProducto,
  };
}
