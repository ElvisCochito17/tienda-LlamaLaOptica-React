import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ItemCarrito } from '../componentes/ItemCarrito';
import { ResumenTotal } from '../componentes/ResumenTotal';
import { productosLentes } from '../data/productos';
import { regionesYComunas } from '../data/regiones'; // <--- Tu nuevo archivo desacoplado
import '../css/Carritopagina.css';

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [comprado, setComprado] = useState(false);
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: '',
    email: '',
    rut: '',
    direccion: '',
    region: '',
    comuna: '',
    metodoPago: 'webpay'
  });

  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(productosGuardados);
  }, []);

  const guardarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event('carritoActualizado'));
    window.dispatchEvent(new Event('storage'));
  };

  const incrementarCantidad = (id) => {
    const nuevo = carrito.map((p) =>
      p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
    );
    guardarCarrito(nuevo);
  };

  const decrementarCantidad = (id) => {
    const nuevo = carrito
      .map((p) => (p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p))
      .filter((p) => p.cantidad > 0);
    guardarCarrito(nuevo);
  };

  const eliminarProducto = (id) => {
    const nuevo = carrito.filter((p) => p.id !== id);
    guardarCarrito(nuevo);
  };

  // Cálculos de montos
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

  // Manejo de inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si cambia la región, reseteamos la comuna a vacío
    if (name === 'region') {
      setDatosEnvio({
        ...datosEnvio,
        region: value,
        comuna: ''
      });
    } else {
      setDatosEnvio({
        ...datosEnvio,
        [name]: value
      });
    }
  };

  const handleSimularPago = (e) => {
    e.preventDefault();
    if (carrito.length === 0) return;

    // 1. Construir la estructura completa de la orden
    const nuevaOrden = {
      id: Math.floor(1000 + Math.random() * 9000), // ID único
      cliente: datosEnvio.nombre,
      email: datosEnvio.email,
      rut: datosEnvio.rut,
      direccion: `${datosEnvio.direccion}, ${datosEnvio.comuna}, ${datosEnvio.region}`,
      metodoPago:
        datosEnvio.metodoPago === 'webpay'
          ? 'Tarjeta (Webpay)'
          : datosEnvio.metodoPago === 'mercadopago'
          ? 'Mercado Pago'
          : 'Transferencia Bancaria Directa',
      fecha: new Date().toLocaleDateString('es-CL'),
      total: totalFinal,
      estado: 'Pagado',
      productos: [...carrito]
    };

    // 2. Guardar en mis_ordenes para la vista del cliente (Pedidos.jsx)
    const misOrdenesGuardadas = JSON.parse(localStorage.getItem('mis_ordenes')) || [];
    localStorage.setItem('mis_ordenes', JSON.stringify([nuevaOrden, ...misOrdenesGuardadas]));

    // 3. Guardar en ordenes_admin para la vista del panel de control
    const ordenesAdminGuardadas = JSON.parse(localStorage.getItem('ordenes_admin')) || [];
    localStorage.setItem('ordenes_admin', JSON.stringify([nuevaOrden, ...ordenesAdminGuardadas]));

    // 4. Limpiar el carrito de compras
    localStorage.removeItem('carrito');
    setCarrito([]);
    window.dispatchEvent(new Event('carritoActualizado'));
    window.dispatchEvent(new Event('storage'));
    setComprado(true);
  };

  // Obtenemos las comunas según la región que escogió el usuario
  const regionObjeto = regionesYComunas.find(r => r.region === datosEnvio.region);
  const comunasDisponibles = regionObjeto ? regionObjeto.comunas : [];

  if (comprado) {
    return (
      <main className="pedido-main-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>¡Gracias por tu compra, {datosEnvio.nombre}! 🎉</h2>
        <p>Hemos enviado la confirmación y boleta digital a <strong>{datosEnvio.email}</strong>.</p>
        <p>Tu pedido será despachado a la dirección: <strong>{datosEnvio.direccion}, {datosEnvio.comuna}, {datosEnvio.region}</strong>.</p>
        <br />
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/pedidos" className="btn-simular-pago" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '12px 25px' }}>
            Ver Mis Órdenes
          </Link>
          <Link to="/catalogo" className="btn-simular-pago" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '12px 25px', background: '#64748b' }}>
            Volver al Catálogo
          </Link>
        </div>
      </main>
    );
  }

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
          
          {/* LADO IZQUIERDO: Productos */}
          <div className="items-carrito-seccion">
            <h3>Productos Seleccionados</h3>
            {carrito.map((prod) => (
              <ItemCarrito
                key={prod.id}
                producto={prod}
                onIncrementar={incrementarCantidad}
                onDecrementar={decrementarCantidad}
                onEliminar={eliminarProducto}
              />
            ))}
          </div>

          {/* LADO DERECHO: Resumen y Formulario */}
          <div className="checkout-seccion">
            <ResumenTotal 
              subtotal={subtotalBruto} 
              descuento={descuentoTotal} 
              total={totalFinal} 
            />
            
            <div className="formulario-pago-seccion">
              <h3>Datos de Despacho y Pago</h3>
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

                {/* SELECT DE REGIÓN */}
                <div>
                  <label>Región</label>
                  <select name="region" required value={datosEnvio.region} onChange={handleChange}>
                    <option value="">-- Selecciona una región --</option>
                    {regionesYComunas.map((item, index) => (
                      <option key={index} value={item.region}>{item.region}</option>
                    ))}
                  </select>
                </div>

                {/* SELECT DE COMUNA (Bloqueado hasta elegir Región) */}
                <div>
                  <label>Comuna</label>
                  <select 
                    name="comuna" 
                    required 
                    value={datosEnvio.comuna} 
                    onChange={handleChange}
                    disabled={!datosEnvio.region}
                  >
                    <option value="">
                      {datosEnvio.region ? '-- Selecciona una comuna --' : 'Primero selecciona una región'}
                    </option>
                    {comunasDisponibles.map((comunaName, idx) => (
                      <option key={idx} value={comunaName}>{comunaName}</option>
                    ))}
                  </select>
                </div>

                {/* DIRECCIÓN DE ENVÍO (Bloqueada hasta elegir Comuna) */}
                <div>
                  <label>Dirección de Envío</label>
                  <input 
                    type="text" 
                    name="direccion" 
                    placeholder={datosEnvio.comuna ? "Calle y número (Ej: Av. Providencia 1234)" : "Primero selecciona una comuna"} 
                    required 
                    value={datosEnvio.direccion} 
                    onChange={handleChange}
                    disabled={!datosEnvio.comuna}
                  />
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
              </form>
            </div>
          </div>

        </div>
      )}
    </main>
  );
}