// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
const API = import.meta.env.VITE_API_URL;


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    const tokenGuardado = localStorage.getItem("token");

    if (usuarioGuardado && tokenGuardado && tokenGuardado !== "undefined") {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
        setToken(tokenGuardado);
      } catch (e) {
        console.warn("❌ Datos inválidos en localStorage, limpiando...");
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
      }
    }

    setCargando(false); // Ya terminó de intentar cargar desde localStorage
  }, []);

  console.log("Usuario cargado:", usuario);
  console.log("Token cargado:", token);

  // Función para login
  const login = async (correo, contraseña) => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje || "Error al iniciar sesión");

      setUsuario(data.usuario);
      setToken(data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      localStorage.setItem("token", data.token);

      return { ok: true, usuario: data.usuario };
    } catch (err) {
      return { ok: false, mensaje: err.message };
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};
