import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerOrdenes, obtenerUsuarioActivo, pertenecePedido } from '../services/ordenes';
import InsigniaEstado from '../componentes/InsigniaEstado';
import '../css/boleta.css'; // Ocupa tus estilos existentes de boleta

export default function DetallePedido() {
  const { id } = useParams();
  const [orden, setOrden] = useState(null);

  useEffect(() => {
    const usuario = obtenerUsuarioActivo();
    const encontrada = obtenerOrdenes().find((o) => String(o.id) === String(id));
    // Solo el dueño del pedido (o un administrador) puede verlo
    const permitido = encontrada && (pertenecePedido(encontrada, usuario) || usuario?.rol === 'Administrador');
    setOrden(permitido ? encontrada : null);
  }, [id]);

  const handleImprimir = () => {
    window.print();
  };

  if (!orden) {
    return (
      <main className="container my-5 text-center" style={{ minHeight: '65vh' }}>
        <h2>No se encontró el pedido</h2>
        <p className="text-muted">El pedido #{id} no existe o no pertenece a tu cuenta.</p>
        <Link to="/pedidos" className="btn btn-dark fw-bold mt-3">
          Volver a Mis Pedidos
        </Link>
      </main>
    );
  }

  return (
    <main className="container my-5" style={{ minHeight: '65vh' }}>
      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <Link to="/pedidos" className="text-success text-decoration-none fw-bold small">
            &lt; Volver a Mis Pedidos
          </Link>
          <h1 className="fw-bold mb-0 mt-1">Detalle del Pedido #{orden.id}</h1>
          <p className="text-muted mb-0">Realizado el {orden.fecha}</p>
        </div>
        <button className="btn btn-primary fw-bold" onClick={handleImprimir}>
          Imprimir / Guardar Boleta
        </button>
      </div>

      <div className="row g-4">
        {/* LADO IZQUIERDO: Información del despacho y lista de productos */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-dark text-white fw-bold py-3">
              Información de Despacho y Pago
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <p className="mb-1 text-muted small">Cliente</p>
                  <strong className="d-block">{orden.cliente}</strong>
                  <span className="text-muted small">{orden.email}</span>
                  {orden.rut && <div className="small text-muted">RUT: {orden.rut}</div>}
                </div>
                <div className="col-md-6">
                  <p className="mb-1 text-muted small">Dirección de Despacho</p>
                  <strong>{orden.direccion}</strong>
                </div>
                <div className="col-12 border-top pt-2 mt-3">
                  <p className="mb-1 text-muted small">Método de Pago</p>
                  <span className="badge bg-light text-dark border me-2">{orden.metodoPago}</span>
                  <InsigniaEstado estado={orden.estado} />
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white fw-bold py-3">
              Productos Comprados
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-end">Precio U.</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orden.productos && orden.productos.map((prod, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {prod.imagen && (
                              <img 
                                src={prod.imagen} 
                                alt={prod.titulo} 
                                style={{ width: '45px', height: '45px', objectFit: 'contain', borderRadius: '6px', background: '#f8f9fa' }} 
                              />
                            )}
                            <span className="fw-bold">{prod.titulo}</span>
                          </div>
                        </td>
                        <td className="text-center fw-bold">{prod.cantidad}</td>
                        <td className="text-end">${prod.precio.toLocaleString('es-CL')}</td>
                        <td className="text-end fw-bold">${(prod.precio * prod.cantidad).toLocaleString('es-CL')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: Boleta Digital Imprimible */}
        <div className="col-lg-5">
          <div className="boleta-contenedor shadow-sm">
            <div className="boleta-cabecera">
              <h1>LLAMA LA ÓPTICA</h1>
              <p style={{ margin: '2px 0', fontSize: '12px' }}>R.U.T.: 76.890.123-4</p>
              <p style={{ margin: '2px 0', fontSize: '12px' }}>Venta de Lentes y Artículos Ópticos</p>
              <p style={{ margin: '2px 0', fontSize: '12px' }}>Av. Providencia 1234, Santiago</p>
              <div className="boleta-numero">
                <strong>BOLETA ELECTRÓNICA N° #{orden.id}</strong>
                <br />
                <span style={{ fontSize: '12px' }}>Fecha: {orden.fecha}</span>
              </div>
            </div>

            <div style={{ fontSize: '12px', marginBottom: '15px', borderBottom: '1px dashed #ccc', paddingBottom: '10px' }}>
              <p style={{ margin: '3px 0' }}><strong>Cliente:</strong> {orden.cliente}</p>
              {orden.rut && <p style={{ margin: '3px 0' }}><strong>RUT:</strong> {orden.rut}</p>}
              <p style={{ margin: '3px 0' }}><strong>Despacho:</strong> {orden.direccion}</p>
              <p style={{ margin: '3px 0' }}><strong>Pago:</strong> {orden.metodoPago}</p>
            </div>

            <table className="boleta-tabla">
              <thead>
                <tr>
                  <th>Cant. Item</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orden.productos && orden.productos.map((p, i) => (
                  <tr key={i}>
                    <td>
                      {p.cantidad}x {p.titulo}
                    </td>
                    <td>${(p.precio * p.cantidad).toLocaleString('es-CL')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="boleta-totales">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                <span>Envío:</span>
                <span>GRATIS</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>TOTAL:</span>
                <span>${orden.total.toLocaleString('es-CL')}</span>
              </div>
            </div>

            <div className="boleta-pie">
              <p style={{ margin: '5px 0' }}>*** IVA Incluido ***</p>
              <p style={{ margin: '5px 0' }}>¡Gracias por tu compra en Llama la Óptica!</p>
              <p style={{ margin: '2px 0', fontSize: '10px' }}>www.llamalaoptica.cl</p>
            </div>

            <button className="btn-imprimir" onClick={handleImprimir}>
              Imprimir / Guardar Boleta
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}