import { useState } from "react";
import { Menu, X, UtensilsCrossed } from "lucide-react"; // íconos del botón hamburguesa
import burgerImg from "../assets/images/hamburguesa.jpg"
import arrozImg from "../assets/images/arroz.jpg"
import polloImg from "../assets/images/pollo.jpg"
import pastaImg from "../assets/images/pasta.jpg"
import lasagnaImg from "../assets/images/lasagna.jpg"
import cakeImg from "../assets/images/cakeCafe.jpg"
import logo from "../assets/images/logo.jpg"
import fondo from "../assets/images/fondo.jpg"

export default function Home() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const platos = [
    { id: 1, nombre: "Hamburguesa", img: burgerImg },
    { id: 2, nombre: "Arroz con pollo", img: arrozImg },
    { id: 3, nombre: "Pollo apanado", img: polloImg },
    { id: 4, nombre: "Pasta boloñeza", img: pastaImg },
    { id: 5, nombre: "Lasagna", img: lasagnaImg },
    { id: 6, nombre: "Cheese cake", img: cakeImg },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-50">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 shadow bg-orange-100">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-orange-700 inline-flex items-center gap-2">
          EL SAZÓN DE DANI
          <UtensilsCrossed className="w-6 h-6 animate-bounce" />
        </h1>
        {/* Botón hamburguesa */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="p-2 rounded-md bg-orange-100 hover:bg-orange-200"
        >
          {menuAbierto ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menú lateral */}
        {menuAbierto && (
          <nav className="absolute top-16 right-0 w-48 bg-white shadow-lg rounded-lg p-4 z-20">
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#menu" className="hover:text-orange-600">Menú</a>
              </li>
              <li>
                <a href="login" className="hover:text-orange-600">Ingresar</a>
              </li>
            </ul>
          </nav>
        )}
      </header>
      <section className="relative text-center py-10 overflow-hidden">
        {/* Fondo borroso */}
        <img
          src={fondo}
          alt="fondo"
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />

        {/* Capa oscura encima del fondo */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Contenido encima */}
        <div className="relative z-10 flex flex-col items-center">
          <img
            src={logo}
            alt="Logo restaurante"
            className="w-64 h-64 rounded-full object-cover mb-6"
          />
          <h2 className="text-4xl font-extrabold text-orange-300 mb-4">
            Bienvenido a nuestro restaurante
          </h2>
          <p className="text-2xl text-gray-200 font-bold">
            Disfruta de nuestros platos frescos y deliciosos
          </p>
        </div>
      </section>

      {/* Menú de platos */}
      <section id="menu" className="px-6 py-5">
        <h3 className="text-2xl font-bold mb-6 text-orange-700">Nuestro Menú</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platos.map((plato) => (
            <div
              key={plato.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-2"
            >
              <img
                src={plato.img}
                alt={plato.nombre}
                className="rounded-lg w-full h-72 object-cover"
              />
              <h4 className="text-lg font-semibold mt-2 text-center">{plato.nombre}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
