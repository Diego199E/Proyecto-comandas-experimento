import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/authContext";

const API = import.meta.env.VITE_API_URL;

export default function useInventario() {
  const { token } = useContext(AuthContext);
  const [ingredientes, setIngredientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    obtenerIngredientes();
  }, []);

  const obtenerIngredientes = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API}/api/ingredientes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al obtener ingredientes");
      setIngredientes(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const crearIngrediente = async (nuevo) => {
    try {
      const res = await fetch(`${API}/api/ingredientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevo),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear ingrediente");
      setIngredientes([...ingredientes, data]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const actualizarIngrediente = async (id, actualizado) => {
    try {
      const res = await fetch(`${API}/api/ingredientes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(actualizado),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar ingrediente");

      setIngredientes((prev) =>
        prev.map((i) => (i._id === id ? data : i))
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const eliminarIngrediente = async (id) => {
    try {
      const res = await fetch(`${API}/api/ingredientes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al eliminar ingrediente");
      setIngredientes((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const cambiarDisponibilidad = async (id, disponible) => {
    await actualizarIngrediente(id, { disponible });
  };

  const ingredientesFiltrados = ingredientes.filter((i) =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return {
    ingredientes: ingredientesFiltrados,
    cargando,
    error,
    busqueda,
    setBusqueda,
    crearIngrediente,
    actualizarIngrediente,
    eliminarIngrediente,
    cambiarDisponibilidad,
    obtenerIngredientes
  };
}
