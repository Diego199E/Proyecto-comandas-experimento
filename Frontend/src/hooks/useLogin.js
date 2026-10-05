import { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(correo, contraseña);
    setLoading(false);

    if (res.ok) {
      navigate(res.usuario.rol === "Admin" ? "/panel/inicio" : "/mesero");
    } else {
      setError(res.mensaje);
    }
  };

  return {
    correo,
    setCorreo,
    contraseña,
    setContraseña,
    error,
    loading,
    handleSubmit,
  };
}
