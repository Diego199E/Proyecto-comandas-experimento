// src/hooks/useMeseroActivas.js
import { useState, useEffect } from "react";
import { generarPDFComanda } from "../../utils/generarPDF";

const API = import.meta.env.VITE_API_URL;

export function useMeseroActivas(vista, setCargando) {
  const [comandasActivas, setComandasActivas] = useState([]);


  const obtenerComandas = async () => {
    try {
      const res = await fetch(`${API}/api/comandas`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setComandasActivas(data.filter((c) => !c.estado));
    } catch (err) {
      console.error("Error al obtener comandas activas", err);
    }
  };

  const completarComanda = async (id) => {
    const res = await fetch(`${API}/api/comandas/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje);

    setComandasActivas((prev) => prev.filter((c) => c._id !== id));
  };


  const eliminarComanda = async (id) => {
    try {
      const res = await fetch(`${API}/api/comandas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar comanda");

      setComandasActivas((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar comanda:", error.message);
      alert("❌ No se pudo eliminar la comanda");
    }
  };

  const editarComanda = async (comandaActualizada) => {
    try {
      const res = await fetch(`${API}/api/comandas/${comandaActualizada._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(comandaActualizada),
      });

      if (!res.ok) throw new Error("Error al editar la comanda");

      const data = await res.json();
      console.log("✅ Comanda editada:", data);
    } catch (error) {
      console.error("❌ Error al editar comanda:", error);
      alert("❌ No se pudo editar la comanda");
    }
  };

  useEffect(() => {
    if (vista === "activas") obtenerComandas();
    const intervalo = setInterval(obtenerComandas, 4000);
    return () => clearInterval(intervalo);
  }, [vista]);

  return {
    comandasActivas,
    completarComanda,
    eliminarComanda,
    editarComanda,
    generarPDF: generarPDFComanda,
  };
}
