import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerOrdenes } from '../services/ordenes';
import ResumenOrden from '../componentes/ResumenOrden';

// Vista "Pago correcto": se llega aquí desde el carrito cuando la compra se registró bien.
export default function PagoCorrecto() {
  const { id } = useParams();
  const [orden] = useState(() => obtenerOrdenes().find((o) => String(o.id) === String(id)) || null);

  if (!orden) {
    return (
      <main className="container my-5 text-center" style={{ minHeight: '65vh' }}>
        <h2>No encontramos esa compra</h2>
        <p className="text-muted">La orden #{id} no existe en este navegador.</p>
        <Link to="/catalogo" className="btn btn-dark fw-bold">
          Volver al catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="container my-5" style={{ minHeight: '65vh', maxWidth: 820 }}>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <h1 className="h3 fw-bold text-success mb-0">
              <span aria-hidden="true">✔ </span>¡Pago correcto! Compra N° #{orden.id}
            </h1>
            <small className="text-muted">{orden.fecha}</small>
          </div>
          <p className="text-muted mt-2">
            Enviamos la confirmación y la boleta digital a <strong>{orden.email}</strong>.
          </p>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <p className="mb-1 text-muted small">Cliente</p>
              <strong>{orden.cliente}</strong>
              {orden.rut && <div className="small text-muted">RUT: {orden.rut}</div>}
            </div>
            <div className="col-md-6">
              <p className="mb-1 text-muted small">Dirección de despacho</p>
              <strong>{orden.direccion}</strong>
            </div>
            <div className="col-12">
              <p className="mb-1 text-muted small">Método de pago</p>
              <span className="badge bg-light text-dark border">{orden.metodoPago}</span>
            </div>
          </div>

          <ResumenOrden productos={orden.productos} total={orden.total} />

          <div className="d-flex gap-2 justify-content-center flex-wrap mt-4">
            <button type="button" className="btn btn-danger fw-bold" onClick={() => window.print()}>
              Imprimir boleta
            </button>
            <Link to={`/pedido/${orden.id}`} className="btn btn-success fw-bold">
              Ver detalle y boleta
            </Link>
            <Link to="/pedidos" className="btn btn-dark fw-bold">
              Mis pedidos
            </Link>
            <Link to="/catalogo" className="btn btn-outline-secondary fw-bold">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
