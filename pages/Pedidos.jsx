import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Pedidos() {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    const ordenesGuardadas = JSON.parse(localStorage.getItem('mis_ordenes')) || [];
    setOrdenes(ordenesGuardadas);
  }, []);

  return (
    <main className="container my-5" style={{ minHeight: '65vh' }}>
      <div className="mb-4">
        <h1 className="fw-bold">Mis Pedidos</h1>
        <p className="text-muted">Revisa el historial de tus compras y accede a los detalles de cada pedido.</p>
      </div>

      {ordenes.length === 0 ? (
        <div className="text-center py-5 border rounded bg-light shadow-sm">
          <p className="fs-5 text-muted mb-3">Aún no has realizado ninguna compra.</p>
          <Link to="/catalogo" className="btn btn-primary px-4 py-2 fw-bold">
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {ordenes.map((orden) => (
            <div key={orden.id} className="card shadow-sm border-0 rounded-3 overflow-hidden">
              <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3 px-4">
                <div>
                  <strong className="fs-5 me-2">Orden #{orden.id}</strong>
                  <span className="text-light small">| Fecha: {orden.fecha}</span>
                </div>
                <span className={`badge px-3 py-2 ${
                  orden.estado === 'Pagado' ? 'bg-warning text-dark' : 
                  orden.estado === 'Enviado' ? 'bg-primary' : 'bg-success'
                }`}>
                  {orden.estado}
                </span>
              </div>

              <div className="card-body px-4 py-3">
                <div className="row g-3 align-items-center">
                  <div className="col-md-4">
                    <p className="mb-1 text-muted small">Cliente</p>
                    <strong className="d-block">{orden.cliente}</strong>
                    <span className="text-muted small">{orden.email}</span>
                  </div>
                  <div className="col-md-5">
                    <p className="mb-1 text-muted small">Dirección de Despacho</p>
                    <span>{orden.direccion}</span>
                  </div>
                  <div className="col-md-3 text-md-end">
                    <p className="mb-1 text-muted small">Total Pagado</p>
                    <strong className="fs-4 text-success">${orden.total.toLocaleString('es-CL')}</strong>
                  </div>
                </div>
              </div>

              <div className="card-footer bg-light text-end py-3 px-4">
                <Link to={`/pedido/${orden.id}`} className="btn btn-dark fw-bold">
                  Ver Detalle del Pedido
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}