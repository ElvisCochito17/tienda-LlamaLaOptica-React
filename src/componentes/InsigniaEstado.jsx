// Muestra el estado de una orden con su color. Se reutiliza en
// "Mis pedidos", detalle del pedido, órdenes del admin y dashboard.
const COLORES = {
  Pagado: 'bg-warning text-dark',
  Enviado: 'bg-primary',
  Entregado: 'bg-success',
};

export default function InsigniaEstado({ estado, pill = false, className = '' }) {
  const color = COLORES[estado] || 'bg-secondary';
  return (
    <span className={`badge ${pill ? 'rounded-pill' : ''} ${color} ${className}`.replace(/\s+/g, ' ').trim()}>
      {estado}
    </span>
  );
}
