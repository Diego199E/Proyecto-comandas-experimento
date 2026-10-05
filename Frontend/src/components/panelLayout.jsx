import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Home, Users, ScrollText, UserRoundPlus, X, ChartLine, Utensils, PackageSearch,ShoppingBasket } from "lucide-react";

export default function PanelLayout({ usuario, onLogout, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  if (!usuario) return null;

  const botones = [
    { label: "Inicio", ruta: "/panel/inicio" , icon: <Home size={18} /> },
    { label: "Resumen", ruta: "/panel/resumen", icon: <ChartLine size={18} /> },
    { label: "Menú", ruta: "/panel/menu", icon: <Utensils size={18} /> },
    { label: "Productos", ruta: "/panel/productos", icon: <ShoppingBasket size={18} /> },
    { label: "Inventario", ruta: "/panel/inventario", icon: <PackageSearch size={18} /> },
    { label: "Comandas", ruta: "/panel/comandas", icon: <ScrollText size={18} /> },
    { label: "Usuarios", ruta: "/panel/usuarios", icon: <Users size={18} /> },
    { label: "Registrar usuario", ruta: "/panel/register", icon: <UserRoundPlus size={18} /> },
    { label: "Mesero", ruta: "/panel/mesero", icon: <Utensils size={18} />},
  ];

  const tituloActual = botones.find((btn) => btn.ruta === location.pathname)?.label || "Panel";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-stone-200 text-gray-800 relative">
      {/* Fondo oscuro móvil */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* Sidebar (siempre fijo) */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 
        bg-gradient-to-br from-[#f2d2b6] via-[#e6bfa0] to-[#d9a88a]

        shadow-lg z-50 transform transition-transform duration-300
        ${menuAbierto ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 text-center border-b border-b-gray-600">
          <h2 className="text-xl font-bold">{usuario.nombre} - {usuario.rol}</h2>
          <p className="text-sm text-gray-600">{usuario.empresa?.nombre}</p>
        </div>
        <nav className="p-4 space-y-2">
          {botones.map((btn) => (
            <button
              key={btn.ruta}
              onClick={() => {
                setMenuAbierto(false);
                navigate(btn.ruta);
              }}
              className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded ${location.pathname === btn.ruta
                ? "bg-amber-600  text-white"
                : "hover:bg-gray-200 text-gray-800"
                }`}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}

          {/* Cerrar sesión solo visible en móvil */}
          <div className="p-4 border-t border-t-gray-600 mt-4 md:hidden">
            <button
              onClick={onLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </nav>
      </aside>

      {/* Contenido principal */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <header className="bg-gradient-to-br from-amber-200 to-orange-200 shadow p-4 flex items-center justify-between relative">
          {/* Botón hamburguesa solo en móvil */}
          <div className="md:hidden">
            <button onClick={() => setMenuAbierto(!menuAbierto)}>
              {menuAbierto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Título centrado */}
          <h1 className="mx-auto md:absolute md:left-1/2 md:-translate-x-1/2 text-lg font-semibold">
            {tituloActual}
          </h1>

          {/* Botón cerrar sesión visible solo en escritorio */}
          <div className="hidden md:flex items-center ml-auto">
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </header>


        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
