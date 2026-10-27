import { useState, useEffect } from 'react';
import '../css/boleta.css'; // Carga los estilos para el comprobante de boleta

export default function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenDetalle, setOrdenDetalle] = useState(null); // Modal para ver detalle completo
  const [boletaVer, setBoletaVer] = useState(null);       // Modal para ver boleta electrónica

  useEffect(() => {
    const ordenesGuardadas = JSON.parse(localStorage.getItem('ordenes_admin'));
    
    if (ordenesGuardadas && ordenesGuardadas.length > 0) {
      setOrdenes(ordenesGuardadas);
    } else {
      // Datos simulados por defecto
      const simuladas = [
        { 
          id: 9858, 
          cliente: "vicente", 
          email: "vicente@correo.cl",
          rut: "19.876.543-2",
          direccion: "Av. Providencia 1234, Providencia, Región Metropolitana",
          metodoPago: "Tarjeta (Webpay)",
          fecha: "26-10-2026", 
          total: 20990, 
          estado: "Pagado",
          productos: [
            { id: 1, titulo: "Lentes de hombre sencillos", cantidad: 1, precio: 20990, imagen: "/img/Lentes2.jpg" }
          ]
        },
        { 
          id: 1024, 
          cliente: "Gabriel Tapia", 
          email: "gabriel@correo.cl",
          rut: "18.765.432-1",
          direccion: "Calle Los Leones 432, Providencia, Región Metropolitana",
          metodoPago: "Mercado Pago",
          fecha: "26/10/2026", 
          total: 32980, 
          estado: "Pagado",
          productos: [
            { id: 0, titulo: "Lentes de mujer metalicos", cantidad: 1, precio: 25490, imagen: "/img/Lentes1.jpg" }
          ]
        }
      ];
      setOrdenes(simuladas);
      localStorage.setItem('ordenes_admin', JSON.stringify(simuladas));
    }
  }, []);

  const marcarComoEnviado = (id) => {
    const actualizadas = ordenes.map(o => 
      o.id === id ? { ...o, estado: "Enviado" } : o
    );
    setOrdenes(actualizadas);
    localStorage.setItem('ordenes_admin', JSON.stringify(actualizadas));

    // Sincroniza también con el historial del cliente
    const misOrdenes = JSON.parse(localStorage.getItem('mis_ordenes')) || [];
    const misActualizadas = misOrdenes.map(o =>
      o.id === id ? { ...o, estado: "Enviado" } : o
    );
    localStorage.setItem('mis_ordenes', JSON.stringify(misActualizadas));
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Historial de Órdenes</h2>
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover table-striped mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th>N° Orden</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="text-center">Detalle y Boleta</th>
                <th className="text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map(o => (
                <tr key={o.id}>
                  <td className="fw-bold">#{o.id}</td>
                  <td>{o.cliente}</td>
                  <td>{o.fecha}</td>
                  <td>${o.total.toLocaleString('es-CL')}</td>
                  <td>
                    <span className={`badge ${o.estado === 'Pagado' ? 'bg-warning text-dark' : o.estado === 'Enviado' ? 'bg-primary' : 'bg-success'}`}>
                      {o.estado}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button 
                        className="btn btn-sm btn-outline-info fw-bold" 
                        onClick={() => setOrdenDetalle(o)}
                        title="Ver detalles de la orden"
                      >
                        Detalle
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-dark fw-bold" 
                        onClick={() => setBoletaVer(o)}
                        title="Ver boleta electrónica"
                      >
                         Boleta
                      </button>
                    </div>
                  </td>
                  <td className="text-center">
                    {o.estado === 'Pagado' ? (
                      <button className="btn btn-sm btn-outline-primary fw-bold" onClick={() => marcarComoEnviado(o.id)}>
                        Enviar
                      </button>
                    ) : (
                      <span className="text-muted small">✓ Gestionado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL 1: DETALLE DE LA ORDEN --- */}
      {ordenDetalle && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1050, padding: '20px'
          }}
        >
          <div className="bg-white rounded-3 p-4 shadow-lg" style={{ maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h4 className="fw-bold m-0">Detalle de la Orden #{ordenDetalle.id}</h4>
              <button className="btn-close" onClick={() => setOrdenDetalle(null)}></button>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <p className="mb-1"><strong>Cliente:</strong> {ordenDetalle.cliente}</p>
                <p className="mb-1"><strong>Correo:</strong> {ordenDetalle.email || 'No registrado'}</p>
                <p className="mb-1"><strong>RUT:</strong> {ordenDetalle.rut || '76.123.456-7'}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1"><strong>Fecha:</strong> {ordenDetalle.fecha}</p>
                <p className="mb-1"><strong>Dirección:</strong> {ordenDetalle.direccion || 'Despacho domicilio'}</p>
                <p className="mb-1"><strong>Método de Pago:</strong> {ordenDetalle.metodoPago || 'Tarjeta (Webpay)'}</p>
              </div>
            </div>

            <h6 className="fw-bold text-muted border-bottom pb-2">Productos en la Orden:</h6>
            {ordenDetalle.productos && ordenDetalle.productos.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-sm table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-end">Precio U.</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenDetalle.productos.map((prod, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {prod.imagen && (
                              <img src={prod.imagen} alt={prod.titulo} style={{ width: '35px', height: '35px', objectFit: 'contain', borderRadius: '4px', background: '#f8f9fa' }} />
                            )}
                            <span className="fw-bold small">{prod.titulo}</span>
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
            ) : (
              <p className="text-muted small">Sin desglose de productos individuales.</p>
            )}

            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
              <button 
                className="btn btn-dark btn-sm fw-bold" 
                onClick={() => {
                  const o = ordenDetalle;
                  setOrdenDetalle(null);
                  setBoletaVer(o);
                }}
              >
                Abrir Boleta Electrónica
              </button>

              <div>
                <span className="me-2 fw-bold text-muted">Total Pagado:</span>
                <strong className="fs-5 text-success">${ordenDetalle.total.toLocaleString('es-CL')}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: BOLETA ELECTRÓNICA IMPRIMIBLE --- */}
      {boletaVer && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1050, padding: '20px', overflowY: 'auto'
          }}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
            <button 
              onClick={() => setBoletaVer(null)}
              style={{
                position: 'absolute', top: '-15px', right: '-15px', background: '#000',
                color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px',
                fontWeight: 'bold', cursor: 'pointer', zIndex: 1100
              }}
            >
              ✕
            </button>

            <div className="boleta-contenedor">
              <div className="boleta-cabecera">
                <h1>LLAMA LA ÓPTICA</h1>
                <p style={{ margin: '2px 0', fontSize: '12px' }}>R.U.T.: 76.890.123-4</p>
                <p style={{ margin: '2px 0', fontSize: '12px' }}>Venta de Lentes y Artículos Ópticos</p>
                <p style={{ margin: '2px 0', fontSize: '12px' }}>Av. Providencia 1234, Santiago</p>
                <div className="boleta-numero">
                  <strong>BOLETA ELECTRÓNICA N° #{boletaVer.id}</strong>
                  <br />
                  <span style={{ fontSize: '12px' }}>Fecha: {boletaVer.fecha}</span>
                </div>
              </div>

              <div style={{ fontSize: '12px', marginBottom: '15px', borderBottom: '1px dashed #ccc', paddingBottom: '10px' }}>
                <p style={{ margin: '3px 0' }}><strong>Cliente:</strong> {boletaVer.cliente}</p>
                {boletaVer.rut && <p style={{ margin: '3px 0' }}><strong>RUT:</strong> {boletaVer.rut}</p>}
                <p style={{ margin: '3px 0' }}><strong>Despacho:</strong> {boletaVer.direccion || 'Despacho estándar'}</p>
                <p style={{ margin: '3px 0' }}><strong>Pago:</strong> {boletaVer.metodoPago || 'Tarjeta (Webpay)'}</p>
              </div>

              <table className="boleta-tabla">
                <thead>
                  <tr>
                    <th>Cant. Item</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {boletaVer.productos && boletaVer.productos.length > 0 ? (
                    boletaVer.productos.map((p, i) => (
                      <tr key={i}>
                        <td>{p.cantidad}x {p.titulo}</td>
                        <td>${(p.precio * p.cantidad).toLocaleString('es-CL')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>1x Compra de Lentes</td>
                      <td>${boletaVer.total.toLocaleString('es-CL')}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="boleta-totales">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                  <span>Envío:</span>
                  <span>GRATIS</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>TOTAL:</span>
                  <span>${boletaVer.total.toLocaleString('es-CL')}</span>
                </div>
              </div>

              <div className="boleta-pie">
                <p style={{ margin: '5px 0' }}>*** IVA Incluido ***</p>
                <p style={{ margin: '5px 0' }}>¡Gracias por tu compra en Llama la Óptica!</p>
                <p style={{ margin: '2px 0', fontSize: '10px' }}>www.llamalaoptica.cl</p>
              </div>

              <button className="btn-imprimir" onClick={handleImprimir}>
                Imprimir Boleta / PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}