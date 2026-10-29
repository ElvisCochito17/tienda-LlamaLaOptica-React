import Cabecera from './componentes/Cabecera'
import './css/estilos.css'
import Pie from './componentes/Pie'
import Home from './pages/home'
import Catalogo from './pages/catalogo'
import Quienes_somos from './pages/quienes_somos'
import Blog from './pages/blog'
import Login from './pages/login';
import Registro from './pages/registro';
import DetalleProducto from './pages/Detalleproducto';
import Contacto from './pages/Contacto';
import Carrito from './pages/Carrito';
import Perfil from './pages/perfil';
import DetalleBlog from './pages/DetalleBlog'
import Pedidos from './pages/Pedidos';
import DetallePedido from './pages/DetallePedido';
import PagoCorrecto from './pages/PagoCorrecto';
import PagoError from './pages/PagoError';

import AdminLayout from "./pages/adminmain";
import AdminUsuarios from './pages/adminusuarios'
import AdminProductos from './pages/adminproductos'
import AdminOrdenes from './pages/adminordenes';
import AdminDashboard from './pages/admindashboard';
import AdminReportes from './pages/adminreportes';
import AdminCategorias from './pages/admincategorias';
// CORRECCIÓN: La primera letra debe ser mayúscula para que React lo reconozca como componente
import AdminPerfil from './pages/adminperfil' 

import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        {/* Rutas Públicas*/}
        <Route path='/' element={<><Cabecera /><Home /><Pie /></>} />
        <Route path='/catalogo' element={<><Cabecera /><Catalogo /><Pie /></>} />
        <Route path='/quienes_somos' element={<><Cabecera /><Quienes_somos /><Pie /></>} />
        <Route path='/blog' element={<><Cabecera /><Blog /><Pie /></>} />
        <Route path='/login' element={<><Cabecera /><Login /><Pie /></>} />
        <Route path='/registro' element={<><Cabecera /><Registro /><Pie /></>} />
        <Route path='/contacto' element={<><Cabecera /><Contacto /><Pie /></>} />
        <Route path='/carrito' element={<><Cabecera /><Carrito /><Pie /></>} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path='/blog/:id' element={<DetalleBlog/>}/>

        {/* RUTAS CORREGIDAS PARA EL FLUJO DE COMPRA */}
        <Route path='/producto/:id' element={<><Cabecera /><DetalleProducto /><Pie /></>} />
        <Route path='/pedidos' element={<><Cabecera /><Pedidos /><Pie /></>} />
        <Route path='/pedido/:id' element={<><Cabecera /><DetallePedido /><Pie /></>} />
        <Route path='/pago-correcto/:id' element={<><Cabecera /><PagoCorrecto /><Pie /></>} />
        <Route path='/pago-error' element={<><Cabecera /><PagoError /><Pie /></>} />

        {/* Rutas de Administración (usan AdminLayout en lugar de Cabecera/Pie) */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path='usuarios' element={<AdminUsuarios />} />
          <Route path='productos' element={<AdminProductos />} />
          <Route path='categorias' element={<AdminCategorias />} />
          <Route path='ordenes' element={<AdminOrdenes />} />
          <Route path='reportes' element={<AdminReportes />} />
          <Route path='perfil' element={<AdminPerfil />} />
        </Route>
      </Routes>
    </>
  )
}

export default App