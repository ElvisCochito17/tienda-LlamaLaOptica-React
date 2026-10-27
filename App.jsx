import { useState } from 'react'
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
import Contacto from './pages/contacto';
import Carrito from './pages/carrito';
import Pedidos from './pages/Pedidos';
import DetallePedido from './pages/DetallePedido'; // <--- Importación de la nueva vista

import AdminLayout from "./pages/adminmain";
import AdminUsuarios from './pages/adminusuarios'
import AdminProductos from './pages/adminproductos'
import AdminOrdenes from './pages/adminordenes';
import AdminDashboard from './pages/admindashboard';

import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        {/* Rutas Públicas */}
        <Route path='/' element={<><Cabecera /><Home /><Pie /></>} />
        <Route path='/catalogo' element={<><Cabecera /><Catalogo /><Pie /></>} />
        <Route path='/quienes_somos' element={<><Cabecera /><Quienes_somos /><Pie /></>} />
        <Route path='/blog' element={<><Cabecera /><Blog /><Pie /></>} />
        <Route path='/login' element={<><Cabecera /><Login /><Pie /></>} />
        <Route path='/registro' element={<><Cabecera /><Registro /><Pie /></>} />
        <Route path='/contacto' element={<><Cabecera /><Contacto /><Pie /></>} />
        <Route path='/carrito' element={<><Cabecera /><Carrito /><Pie /></>} />
        <Route path='/pedidos' element={<><Cabecera /><Pedidos /><Pie /></>} />

        {/* RUTA DE DETALLE DE PEDIDO CON BOLETA */}
        <Route path='/pedido/:id' element={<><Cabecera /><DetallePedido /><Pie /></>} />

        {/* Ruta para el producto */}
        <Route path='/producto/:id' element={<><Cabecera /><DetalleProducto /><Pie /></>} />

        {/* Rutas de Administración */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path='usuarios' element={<AdminUsuarios />} />
          <Route path='productos' element={<AdminProductos />} />
          <Route path='ordenes' element={<AdminOrdenes />} />
        </Route>
      </Routes>
    </>
  )
}

export default App