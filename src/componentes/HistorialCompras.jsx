import { Link } from 'react-router-dom';
import InsigniaEstado from './InsigniaEstado';

// Ventana (modal de Bootstrap) con el historial de compras de un usuario.
// Recibe todo por props: no lee localStorage, así es fácil de probar.
export default function HistorialCompras({ usuario, ordenes = [], onCerrar }) {
  const totalGastado = ordenes.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-label="Historial de compras">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title mb-0">Historial de compras</h5>
                <small className="text-muted">
                  {usuario.nombre} · {usuario.email}
                </small>
              </div>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
            </div>

            <div className="modal-body">
              {ordenes.length === 0 ? (
                <p className="text-muted text-center my-4">Este usuario aún no ha realizado compras.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Orden</th>
                        <th>Fecha</th>
                        <th>Productos</th>
                        <th>Estado</th>
                        <th className="text-end">Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordenes.map((o) => (
                        <tr key={o.id}>
                          <td className="fw-bold">#{o.id}</td>
                          <td>{o.fecha}</td>
                          <td>{(o.productos || []).reduce((acc, p) => acc + (Number(p.cantidad) || 0), 0)}</td>
                          <td>
                            <InsigniaEstado estado={o.estado} />
                          </td>
                          <td className="text-end fw-bold">${Number(o.total).toLocaleString('es-CL')}</td>
                          <td className="text-end">
                            <Link to={`/pedido/${o.id}`} className="btn btn-sm btn-outline-dark">
                              Ver boleta
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-footer d-flex justify-content-between">
              <span className="fw-bold">
                {ordenes.length} {ordenes.length === 1 ? 'compra' : 'compras'} · Total gastado: $
                {totalGastado.toLocaleString('es-CL')}
              </span>
              <button type="button" className="btn btn-secondary" onClick={onCerrar}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}
