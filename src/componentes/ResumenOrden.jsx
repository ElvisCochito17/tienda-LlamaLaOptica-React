// Tabla de productos + total de una orden. Se usa en las páginas de pago correcto / con error.
export default function ResumenOrden({ productos = [], total }) {
  const totalMostrado =
    total ?? productos.reduce((acc, p) => acc + (Number(p.precio) || 0) * (Number(p.cantidad) || 0), 0);

  return (
    <div>
      <div className="table-responsive">
        <table className="table align-middle mb-3">
          <thead className="table-light">
            <tr>
              <th>Producto</th>
              <th className="text-center">Cant.</th>
              <th className="text-end">Precio</th>
              <th className="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id ?? p.titulo}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    {p.imagen && (
                      <img src={p.imagen} alt={p.titulo} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                    )}
                    <span className="fw-semibold">{p.titulo}</span>
                  </div>
                </td>
                <td className="text-center">{p.cantidad}</td>
                <td className="text-end">${Number(p.precio).toLocaleString('es-CL')}</td>
                <td className="text-end fw-bold">${(p.precio * p.cantidad).toLocaleString('es-CL')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-light rounded text-center fs-5 fw-bold">
        Total: ${Number(totalMostrado).toLocaleString('es-CL')}
      </div>
    </div>
  );
}
