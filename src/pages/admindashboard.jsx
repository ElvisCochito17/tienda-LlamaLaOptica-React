import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerOrdenes } from '../services/ordenes';
import { obtenerProductos } from '../services/productos';
import TarjetaMetrica from '../componentes/TarjetaMetrica';
import InsigniaEstado from '../componentes/InsigniaEstado';

export default function AdminDashboard() {
  // 1. Agregamos stockTotal a nuestras métricas
  const [metricas, setMetricas] = useState({ compras: 0, productos: 0, usuarios: 0, stockTotal: 0 });
  const [ultimasOrdenes, setUltimasOrdenes] = useState([]);

  useEffect(() => {
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];
    const productosGuardados = obtenerProductos();
    const ordenesGuardadas = obtenerOrdenes();

    // 2. Calculamos el stock total sumando el stock de cada producto
    const totalUnidades = productosGuardados.reduce((acumulador, producto) => {
      // Usamos Number() por si algún stock quedó guardado como texto accidentalmente
      return acumulador + (Number(producto.stock) || 0);
    }, 0);

    setMetricas({
      compras: ordenesGuardadas.length,
      productos: productosGuardados.length,
      usuarios: usuariosGuardados.length,
      stockTotal: totalUnidades // Guardamos el cálculo aquí
    });

    setUltimasOrdenes(ordenesGuardadas.slice(0, 4)); // las órdenes se guardan de la más nueva a la más antigua
  }, []);

  return (
    <div className="container mt-4 mb-5">
      <div className="mb-4">
        <h2>Dashboard</h2>
        <p className="text-muted">Resumen de las actividades diarias</p>
      </div>

      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <TarjetaMetrica titulo="Compras" valor={metricas.compras} color="primary" />
        </div>

        <div className="col-md-4">
          <TarjetaMetrica titulo="Productos" valor={metricas.productos} color="success">
            {/* Etiqueta tipo "píldora" con el total de unidades */}
            <span className="badge bg-white text-success px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: '0.85rem' }}>
              {metricas.stockTotal} Unidades disponibles
            </span>
          </TarjetaMetrica>
        </div>

        <div className="col-md-4">
          <TarjetaMetrica titulo="Usuarios" valor={metricas.usuarios} color="warning" />
        </div>
      </div>

      <div className="row g-3 mb-5">
        <div className="col-6 col-lg">
          <Link to="/admin/ordenes" className="card text-center shadow-sm text-decoration-none text-dark border-0 py-3 h-100 hover-shadow">
            <div className="card-body">
              <h5 className="card-title text-primary">Órdenes</h5>
              <p className="card-text text-muted small">Gestión y seguimiento de todas las órdenes realizadas.</p>
            </div>
          </Link>
        </div>
        <div className="col-6 col-lg">
          <Link to="/admin/productos" className="card text-center shadow-sm text-decoration-none text-dark border-0 py-3 h-100 hover-shadow">
            <div className="card-body">
              <h5 className="card-title text-success">Productos</h5>
              <p className="card-text text-muted small">Administrar inventario y detalles de los productos.</p>
            </div>
          </Link>
        </div>
        <div className="col-6 col-lg">
          <Link to="/admin/usuarios" className="card text-center shadow-sm text-decoration-none text-dark border-0 py-3 h-100 hover-shadow">
            <div className="card-body">
              <h5 className="card-title text-warning">Usuarios</h5>
              <p className="card-text text-muted small">Gestión de cuentas de usuario y sus roles.</p>
            </div>
          </Link>
        </div>
        <div className="col-6 col-lg">
          <Link to="/admin/reportes" className="card text-center shadow-sm text-decoration-none text-dark border-0 py-3 h-100 hover-shadow">
            <div className="card-body">
              <h5 className="card-title text-secondary">Reportes</h5>
              <p className="card-text text-muted small">Ventas, productos más vendidos e inventario crítico.</p>
            </div>
          </Link>
        </div>
        <div className="col-6 col-lg">
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
                        <InsigniaEstado estado={o.estado} pill />
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