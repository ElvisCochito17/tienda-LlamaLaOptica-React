// Tarjeta de Bootstrap con un número grande (métrica).
// Recibe todo por props; "children" sirve para agregar un detalle extra abajo.
export default function TarjetaMetrica({ titulo, valor, color = 'primary', compacta = false, children }) {
  const colorTexto = color === 'warning' ? 'text-dark' : 'text-white';

  return (
    <div className={`card ${colorTexto} bg-${color} shadow-sm border-0 h-100`}>
      <div className="card-body d-flex flex-column justify-content-center text-center py-3">
        <h5 className="card-title fw-normal mb-1">{titulo}</h5>
        <h2 className={`${compacta ? 'fs-2' : 'display-4'} fw-bold mb-0`}>{valor}</h2>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}
