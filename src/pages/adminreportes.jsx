import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerOrdenes, ESTADOS } from '../services/ordenes';
import {
  resumenVentas,
  productosMasVendidos,
  ventasPorMetodoPago,
  ordenesPorEstado,
  productosCriticos,
  usuariosPorRol,
} from '../services/reportes';
import { obtenerProductos } from '../services/productos';
import TarjetaMetrica from '../componentes/TarjetaMetrica';
import BarraRanking from '../componentes/BarraRanking';

const formatearPesos = (valor) => `$${valor.toLocaleString('es-CL')}`;

export default function AdminReportes() {
  const [ordenes, setOrdenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  useEffect(() => {
    setOrdenes(obtenerOrdenes());

    // Mismo stock que ve el panel de productos y que descuenta el carrito al comprar
    setProductos(obtenerProductos());

    setUsuarios(JSON.parse(localStorage.getItem('usuarios')) || []);
  }, []);

  // El filtro de estado afecta a las métricas, el ranking de productos y los métodos de pago
  const ordenesFiltradas = filtroEstado === 'Todos' ? ordenes : ordenes.filter((o) => o.estado === filtroEstado);

  const resumen = resumenVentas(ordenesFiltradas);
  const masVendidos = productosMasVendidos(ordenesFiltradas, 5);
  const porMetodo = ventasPorMetodoPago(ordenesFiltradas);
  const porEstado = ordenesPorEstado(ordenes);
  const criticos = productosCriticos(productos);
  const porRol = usuariosPorRol(usuarios);

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2>Reportes</h2>
          <p className="text-muted mb-0">Resumen de ventas, inventario y usuarios de la tienda.</p>
        </div>

        <div className="d-flex align-items-end gap-2 d-print-none">
          <div>
            <label htmlFor="filtro-estado" className="form-label small text-muted mb-1">Estado de las órdenes</label>
            <select
              id="filtro-estado"
              className="form-select form-select-sm"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="Todos">Todos</option>
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-dark btn-sm fw-bold" onClick={handleImprimir}>
            Imprimir reporte
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <TarjetaMetrica titulo="Ingresos" valor={formatearPesos(resumen.ingresos)} color="primary" compacta />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <TarjetaMetrica titulo="Órdenes" valor={resumen.totalOrdenes} color="success" compacta />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <TarjetaMetrica titulo="Ticket promedio" valor={formatearPesos(resumen.ticketPromedio)} color="warning" compacta />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <TarjetaMetrica titulo="Unidades vendidas" valor={resumen.unidades} color="secondary" compacta />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-6">
          <BarraRanking
            titulo="Productos más vendidos"
            color="primary"
            mensajeVacio="Aún no hay ventas registradas."
            items={masVendidos.map((p) => ({
              etiqueta: p.titulo,
              valor: p.unidades,
              texto: `${p.unidades} u. · ${formatearPesos(p.ingresos)}`,
            }))}
          />
        </div>
        <div className="col-lg-6">
          <BarraRanking
            titulo="Ingresos por método de pago"
            color="success"
            mensajeVacio="Aún no hay ventas registradas."
            items={porMetodo.map((m) => ({
              etiqueta: m.metodo,
              valor: m.ingresos,
              texto: `${m.ordenes} orden(es) · ${formatearPesos(m.ingresos)}`,
            }))}
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-6">
          <BarraRanking
            titulo="Órdenes por estado"
            color="warning"
            items={porEstado.map((e) => ({ etiqueta: e.estado, valor: e.cantidad, texto: `${e.cantidad}` }))}
          />
        </div>
        <div className="col-lg-6">
          <BarraRanking
            titulo="Usuarios por rol"
            color="secondary"
            mensajeVacio="No hay usuarios registrados."
            items={porRol.map((r) => ({ etiqueta: r.rol, valor: r.cantidad, texto: `${r.cantidad}` }))}
          />
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 fw-bold">Productos con stock crítico</h5>
          <Link to="/admin/productos" className="btn btn-sm btn-outline-primary d-print-none">Ir a productos</Link>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th className="text-end">Stock</th>
                </tr>
              </thead>
              <tbody>
                {criticos.length > 0 ? (
                  criticos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.titulo}</td>
                      <td className="text-end"><span className="badge bg-danger">{p.stock}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">No hay productos con stock crítico.</td>
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
