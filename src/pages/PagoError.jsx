import { Link } from 'react-router-dom';
import ResumenOrden from '../componentes/ResumenOrden';

// Vista "Pago con error": el carrito NO se vacía, así el cliente puede reintentar.
export default function PagoError() {
  let carrito = [];
  try {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  } catch {
    carrito = [];
  }

  return (
    <main className="container my-5" style={{ minHeight: '65vh', maxWidth: 820 }}>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h1 className="h3 fw-bold text-danger">
            <span aria-hidden="true">✖ </span>No se pudo realizar el pago
          </h1>
          <p className="text-muted">
            Tu banco rechazó la transacción y no se te cobró nada. Tus productos siguen en el carrito.
          </p>

          {carrito.length > 0 && <ResumenOrden productos={carrito} />}

          <div className="d-flex gap-2 justify-content-center flex-wrap mt-4">
            <Link to="/carrito" className="btn btn-success fw-bold">
              VOLVER A REALIZAR EL PAGO
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
