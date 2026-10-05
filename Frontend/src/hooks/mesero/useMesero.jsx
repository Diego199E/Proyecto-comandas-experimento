// src/hooks/useMesero.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
const API = import.meta.env.VITE_API_URL;

export const useMesero = () => {
    const { usuario, token, logout } = useContext(AuthContext);
    const [platos, setPlatos] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
    const [seleccionCategoria, setSeleccionCategoria] = useState({});
    const [mesas, setMesas] = useState([{ nombre: "Mesa 1", platos: [] }]);
    const [mesaActiva, setMesaActiva] = useState("Mesa 1");

    const [editandoIndex, setEditandoIndex] = useState(null);


    useEffect(() => {
        const obtenerPlatos = async () => {
            try {
                const res = await fetch(`${API}/api/platos`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setPlatos(data);
            } catch (err) {
                console.error("Error cargando platos:", err);
            }
        };

        if (token) obtenerPlatos();
    }, [token]);

    const abrirModal = (plato, index = null) => {
        setPlatoSeleccionado(plato);
        setSeleccionCategoria(
            index !== null
                ? mesas
                    .find((m) => m.nombre === mesaActiva)
                    .platos[index]?.opciones || {}
                : {}
        );
        setEditandoIndex(index);
        setModalAbierto(true);
    };


    const cerrarModal = () => {
        setModalAbierto(false);
        setPlatoSeleccionado(null);
        setSeleccionCategoria({});
        setEditandoIndex(null);
    };


    const seleccionarOpcion = (categoria, valor) => {
        setSeleccionCategoria((prev) => {
          // Si ya está seleccionada esa opción, al hacer clic otra vez se quita
          if (prev[categoria] === valor) {
            const actualizado = { ...prev };
            delete actualizado[categoria];
            return actualizado;
          }
          // Si es una opción diferente, la selecciona
          return { ...prev, [categoria]: valor };
        });
      };
       

    const agregarMesa = () => {
        const nueva = `Mesa ${mesas.length + 1}`;
        setMesas((prev) => [...prev, { nombre: nueva, platos: [] }]);
        setMesaActiva(nueva);
    };

    const eliminarMesa = (nombre) => {
        if (nombre === "Mesa 1") return;
        setMesas((prev) => prev.filter((m) => m.nombre !== nombre));
        if (mesaActiva === nombre) setMesaActiva("Mesa 1");
    };

    const guardarPlatoMesa = () => {
        if (!mesaActiva || !platoSeleccionado) return;

        const nuevo = {
            nombre: platoSeleccionado.nombre,
            opciones: seleccionCategoria,
        };

        setMesas((prev) =>
            prev.map((m) => {
                if (m.nombre !== mesaActiva) return m;

                const nuevosPlatos = [...m.platos];
                if (editandoIndex !== null) {
                    nuevosPlatos[editandoIndex] = nuevo; // Editar
                } else {
                    nuevosPlatos.push(nuevo); // Agregar
                }

                return { ...m, platos: nuevosPlatos };
            })
        );

        cerrarModal();
    };


    const eliminarPlatoDeMesa = (mesaNombre, index) => {
        setMesas((prev) =>
            prev.map((m) => {
                if (m.nombre === mesaNombre) {
                    const nuevos = [...m.platos];
                    nuevos.splice(index, 1);
                    return { ...m, platos: nuevos };
                }
                return m;
            })
        );
    };

    const enviarComanda = async (nombreMesa) => {
      const mesa = mesas.find((m) => m.nombre === nombreMesa);
      if (!mesa || mesa.platos.length === 0) {
        alert("❌ No hay platos para enviar");
        return;
      }
    
      // Construir platillos incluyendo el precio
      const platillos = mesa.platos.map((plato) => {
        const platoOriginal = platos.find(p => p.nombre === plato.nombre);
    
        return {
          nombre: plato.nombre,
          productos: Object.entries(plato.opciones).map(
            ([categoria, valor]) => `${valor}`
          ),
          precio: platoOriginal?.precio || 0, // ← importante
        };
      });
    
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/comandas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mesa: nombreMesa, platillos }),
        });
    
        const data = await res.json();
    
        if (!res.ok) throw new Error(data.mensaje);
    
        alert("✅ Comanda enviada con éxito");
    
        // Limpiar los platos de esa mesa
        setMesas((prev) =>
          prev.map((m) =>
            m.nombre === nombreMesa ? { ...m, platos: [] } : m
          )
        );
      } catch (err) {
        console.error(err);
        alert("❌ Error al enviar comanda");
      }
    };
    

    return {
        usuario,
        logout,
        platos,
        abrirModal,
        cerrarModal,
        modalAbierto,
        platoSeleccionado,
        seleccionCategoria,
        seleccionarOpcion,
        mesas,
        mesaActiva,
        setMesaActiva,
        agregarMesa,
        eliminarMesa,
        guardarPlatoMesa,
        enviarComanda,
        eliminarPlatoDeMesa,
    };
};
