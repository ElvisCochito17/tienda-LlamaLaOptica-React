import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ItemCarrito } from '../componentes/ItemCarrito';
import { ResumenTotal } from '../componentes/ResumenTotal';
import { productosLentes } from '../data/productos';
import { regionesYComunas } from '../data/regiones';
import { crearOrden, obtenerUsuarioActivo } from '../services/ordenes';
import { obtenerProductos, validarStock, descontarStock } from '../services/productos';
import '../css/Carritopagina.css';

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();
  const [stockPorId, setStockPorId] = useState({}); // { idProducto: unidades disponibles }
  const [avisoStock, setAvisoStock] = useState('');
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: '', email: '', rut: '', direccion: '', region: '', comuna: '', metodoPago: 'webpay'
  });

  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(productosGuardados);

    // Stock actual de cada producto, para no dejar pedir más de lo que hay
    const mapaStock = {};
    obtenerProductos().forEach((p) => { mapaStock[p.id] = Number(p.stock) || 0; });
    setStockPorId(mapaStock);

    // Si hay sesión iniciada, precargamos nombre y correo
    const usuario = obtenerUsuarioActivo();
    if (usuario) {
      setDatosEnvio((prev) => ({ ...prev, nombre: usuario.nombre || '', email: usuario.email || '' }));
    }
  }, []);

  const guardarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const incrementarCantidad = (id) => {
    const item = carrito.find((p) => p.id === id);
    const disponible = stockPorId[id] ?? 0;
    if (item && item.cantidad + 1 > disponible) {
      setAvisoStock(`Solo quedan ${disponible} unidad(es) de "${item.titulo}".`);
      return;
    }
    setAvisoStock('');
    const nuevo = carrito.map((p) => p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p);
    guardarCarrito(nuevo);
  };

  const decrementarCantidad = (id) => {
    const nuevo = carrito.map((p) => (p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p)).filter((p) => p.cantidad > 0);
    guardarCarrito(nuevo);
  };

  const eliminarProducto = (id) => {
    const nuevo = carrito.filter((p) => p.id !== id);
    guardarCarrito(nuevo);
  };

  const totalFinal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const subtotalBruto = carrito.reduce((acc, p) => {
    const productoOriginal = productosLentes.find(prod => prod.id === p.id);
    if (productoOriginal && productoOriginal.enOferta && productoOriginal.precioOriginal) {
      const numOriginal = parseInt(productoOriginal.precioOriginal.replace(/\D/g, ''));
      return acc + (numOriginal * p.cantidad);
    } else if (productoOriginal && productoOriginal.enOferta) {
      return acc + (Math.round(p.precio / 0.85) * p.cantidad);
    }
    return acc + (p.precio * p.cantidad);
  }, 0);

  const descuentoTotal = subtotalBruto > totalFinal ? subtotalBruto - totalFinal : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'region') {
      setDatosEnvio({ ...datosEnvio, region: value, comuna: '' });
    } else {
      setDatosEnvio({ ...datosEnvio, [name]: value });
    }
  };

  const handleSimularPago = (e) => {
    e.preventDefault();
    if (carrito.length === 0) return;

    // 1. Revisar que el stock alcance para todo el carrito (puede haber cambiado desde que se agregó)
    const problemas = validarStock(carrito);
    if (problemas.length > 0) {
      setAvisoStock(
        problemas
          .map((p) => (p.disponible > 0
            ? `"${p.titulo}": pediste ${p.pedido} y solo quedan ${p.disponible}.`
            : `"${p.titulo}" está agotado.`))
          .join(' ')
      );
      return;
    }
    setAvisoStock('');

    // 2. Crear la orden: una sola, que ven el cliente y el administrador, guardada en un único lugar: la ven el cliente y el administrador
    const usuario = obtenerUsuarioActivo();
    const orden = crearOrden({
      usuarioEmail: usuario?.email || datosEnvio.email,
      cliente: datosEnvio.nombre,
      email: datosEnvio.email,
      rut: datosEnvio.rut,
      direccion: `${datosEnvio.direccion}, ${datosEnvio.comuna}, ${datosEnvio.region}`,
      metodoPago: datosEnvio.metodoPago === 'webpay' ? 'Tarjeta (Webpay)' : datosEnvio.metodoPago === 'mercadopago' ? 'Mercado Pago' : 'Transferencia Bancaria Directa',
      total: totalFinal,
      productos: [...carrito]
    });

    // 3. Descontar el stock: el administrador lo ve actualizado en Productos
    descontarStock(carrito);

    // 4. Limpiar el carrito y mostrar la vista de "Pago correcto"
    localStorage.removeItem('carrito');
    setCarrito([]);
    navigate(`/pago-correcto/${orden.id}`);
  };

  // Para la demo: simula que el banco rechazó el pago (no crea orden ni vacía el carrito)
  const handleSimularError = () => navigate('/pago-error');

  const regionObjeto = regionesYComunas.find(r => r.region === datosEnvio.region);
  const comunasDisponibles = regionObjeto ? regionObjeto.comunas : [];

  return (
    <main className="pedido-main-container">
      <h1 className="titulo-seccion">Resumen de tu Pedido</h1>
      {carrito.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '20px' }}>Tu carrito está actualmente vacío.</p>
          <Link to="/catalogo" className="btn-simular-pago" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '12px 25px' }}>Explorar Catálogo</Link>
        </div>
      ) : (
        <div className="pedido-grid-layout">
          <div className="items-carrito-seccion">
            <h3>Productos Seleccionados</h3>
            {carrito.map((prod) => (
              <ItemCarrito key={prod.id} producto={prod} onIncrementar={incrementarCantidad} onDecrementar={decrementarCantidad} onEliminar={eliminarProducto} />
            ))}
          </div>

          <div className="checkout-seccion">
            <ResumenTotal subtotal={subtotalBruto} descuento={descuentoTotal} total={totalFinal} />
            <div className="formulario-pago-seccion">
              <h3>Datos de Despacho y Pago</h3>
              {avisoStock && (
                <div role="alert" style={{ background: '#fdecea', color: '#a93226', border: '1px solid #f5c6cb', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '0.95rem' }}>
                  {avisoStock}
                </div>
              )}
              {/* Formulario tradicional de React */}
              <form onSubmit={handleSimularPago} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label>Nombre y Apellidos</label>
                  <input type="text" name="nombre" placeholder="Ej: Juan Pérez" required value={datosEnvio.nombre} onChange={handleChange} />
                </div>
                <div>
                  <label>Correo Electrónico</label>
                  <input type="email" name="email" placeholder="correo@ejemplo.com" required value={datosEnvio.email} onChange={handleChange} />
                </div>
                <div>
                  <label>RUT</label>
                  <input type="text" name="rut" placeholder="12.345.678-9" maxLength={12} required value={datosEnvio.rut} onChange={handleChange} />
                </div>
                <div>
                  <label>Región</label>
                  <select name="region" required value={datosEnvio.region} onChange={handleChange}>
                    <option value="">-- Selecciona una región --</option>
                    {regionesYComunas.map((item, index) => (
                      <option key={index} value={item.region}>{item.region}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Comuna</label>
                  <select name="comuna" required value={datosEnvio.comuna} onChange={handleChange} disabled={!datosEnvio.region}>
                    <option value="">
                      {datosEnvio.region ? '-- Selecciona una comuna --' : 'Primero selecciona una región'}
                    </option>
                    {comunasDisponibles.map((comunaName, idx) => (
                      <option key={idx} value={comunaName}>{comunaName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Dirección de Envío</label>
                  <input type="text" name="direccion" placeholder={datosEnvio.comuna ? "Calle y número" : "Primero selecciona una comuna"} required value={datosEnvio.direccion} onChange={handleChange} disabled={!datosEnvio.comuna} />
                </div>
                <div>
                  <label>Método de Pago</label>
                  <select name="metodoPago" value={datosEnvio.metodoPago} onChange={handleChange}>
                    <option value="webpay">Tarjeta de Débito / Crédito (Webpay)</option>
                    <option value="mercadopago">Mercado Pago</option>
                    <option value="transferencia">Transferencia Bancaria Directa</option>
                  </select>
                </div>
                <button type="submit" className="btn-simular-pago">
                  Simular Pago (${totalFinal.toLocaleString('es-CL')})
                </button>
                <button type="button" className="btn-simular-pago" style={{ background: '#b91c1c' }} onClick={handleSimularError}>
                  Simular pago rechazado
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}