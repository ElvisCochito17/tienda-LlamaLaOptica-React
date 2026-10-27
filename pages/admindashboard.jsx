import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [metricas, setMetricas] = useState({ compras: 0, productos: 0, usuarios: 0 });
  const [ultimasOrdenes, setUltimasOrdenes] = useState([]);

  // Este useEffect se ejecuta automáticamente cada vez que entras a la pestaña Dashboard
  useEffect(() => {
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];
    const productosGuardados = JSON.parse(localStorage.getItem('productos_admin')) || [];
    const ordenesGuardadas = JSON.parse(localStorage.getItem('ordenes_admin')) || [];

    // Actualizamos las métricas simplemente contando el .length de cada arreglo
    setMetricas({
      compras: ordenesGuardadas.length,
      productos: productosGuardados.length,
      usuarios: usuariosGuardados.length
    });

    // Tomamos las últimas 4 órdenes y las invertimos
    setUltimasOrdenes(ordenesGuardadas.slice(-4).reverse());
  }, []);

  return (
    <div className="container mt-4 mb-5">
      <div className="mb-4">
        <h2>Dashboard</h2>
        <p className="text-muted">Resumen de las actividades diarias</p>
      </div>

      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="card text-white bg-primary shadow-sm border-0 h-100">
            <div className="card-body d-flex flex-column justify-content-center text-center py-4">
              <h5 className="card-title fw-normal">Compras</h5>
              <h2 className="display-4 fw-bold mb-0">{metricas.compras}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success shadow-sm border-0 h-100">
            <div className="card-body d-flex flex-column justify-content-center text-center py-4">
              <h5 className="card-title fw-normal"> Productos</h5>
              <h2 className="display-4 fw-bold mb-0">{metricas.productos}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-dark bg-warning shadow-sm border-0 h-100">
            <div className="card-body d-flex flex-column justify-content-center text-center py-4">
              <h5 className="card-title fw-normal">Usuarios</h5>
              <h2 className="display-4 fw-bold mb-0">{metricas.usuarios}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-5">
        <div className="col-md-3">
          <Link to="/admin/ordenes" className="card text-center shadow-sm text-decoration-none text-dark border-0 py-3 h-100 hover-shadow">
            <div className="card-body">
              <h5 className="card-title text-primary">Órdenes</h5>
              <p className="card-text text-muted small">Gestión y seguimiento de todas las órdenes realizadas.</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="/admin/productos" className="card text-center shadow-sm text-decoration-none text-dark border-0 py-3 h-100 hover-shadow">
            <div className="card-body">
              <h5 className="card-title text-success">Productos</h5>
              <p className="card-text text-muted small">Administrar inventario y detalles de los productos.</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="/admin/usuarios" className="card text-center shadow-sm text-decoration-none text-dark border-0 py-3 h-100 hover-shadow">
            <div className="card-body">
              <h5 className="card-title text-warning">Usuarios</h5>
              <p className="card-text text-muted small">Gestión de cuentas de usuario y sus roles.</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="/" className="card text-center shadow-sm text-decoration-none text-dark border-0 py-3 h-100 hover-shadow bg-light">
            <div className="card-body">
              <h5 className="card-title text-danger">Tienda</h5>
              <p className="card-text text-muted small">Visualiza tu tienda pública en tiempo real.</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 fw-bold">Últimos pedidos efectuados</h5>
          <Link to="/admin/ordenes" className="btn btn-sm btn-outline-primary">Ver historial completo</Link>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-borderless mb-0">
              <thead className="table-light border-bottom">
                <tr>
                  <th>N° Orden</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ultimasOrdenes.length > 0 ? (
                  ultimasOrdenes.map(o => (
                    <tr key={o.id} className="border-bottom">
                      <td className="fw-bold align-middle">#{o.id}</td>
                      <td className="align-middle">{o.cliente}</td>
                      <td className="align-middle text-muted">{o.fecha}</td>
                      <td className="align-middle">${o.total.toLocaleString('es-CL')}</td>
                      <td className="align-middle">
                        <span className={`badge rounded-pill ${o.estado === 'Pagado' ? 'bg-warning text-dark' : o.estado === 'Enviado' ? 'bg-primary' : 'bg-success'}`}>
                          {o.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">Aún no hay compras registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}