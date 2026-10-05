import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/panel/register'
import PanelAdmin from './pages/PanelAdmin';
import Usuarios from './pages/panel/usuarios';
import NotFound from './pages/NotFound';
import Vendedor from './pages/vendedor';
import MeseroA from './pages/panel/mesero';
import Bloqueado from './pages/Bloqueado';
import Platos from './pages/panel/Platos';
import Comandas from './pages/panel/Comandas';
import Mesero from './pages/mesero';
import Inicio from './pages/panel/inicio'
import Resumen from './pages/panel/resumen';
import Inventario from './pages/panel/Inventario';
import Productos from './pages/panel/Productos'

function App() {
  return (
      <Routes>
        <Route path="/panel" element={<PanelAdmin />}>
          <Route path='usuarios' element={<Usuarios />} />
          <Route path="register" element={<Register />} />
          <Route path="menu" element={<Platos />} />
          <Route path="productos" element={<Productos />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="comandas" element={<Comandas />} />
          <Route path="inicio" element={<Inicio />} />
          <Route path="resumen" element={<Resumen />} />
          <Route path="mesero" element={<MeseroA />} />

          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vendedor" element={<Vendedor />} />
        <Route path="/bloqueado" element={<Bloqueado />} />
        <Route path="/mesero" element={<Mesero />} />
        <Route path="/" element={<Home />} />
      </Routes>
  );
}

export default App;

