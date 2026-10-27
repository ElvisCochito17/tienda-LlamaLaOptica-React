export function ResumenTotal({ subtotal, descuento = 0, total }) {
  const formatear = (val) => typeof val === 'number' ? val.toLocaleString('es-CL') : val;

  return (
    <div className="resumen-total-box">
      <h3>Resumen de la Compra</h3>
      
      <div className="fila-pago">
        <span>Subtotal bruto:</span>
        <span>${formatear(subtotal)}</span>
      </div>

      {descuento > 0 && (
        <div className="fila-pago descuento" style={{ color: '#059669', fontWeight: '700' }}>
          <span>Descuentos aplicados:</span>
          <span>-${formatear(descuento)}</span>
        </div>
      )}

      <div className="fila-pago">
        <span>Envío:</span>
        <span style={{ fontWeight: '600', color: '#059669' }}>Gratis</span>
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #e2e8f0', margin: '14px 0' }} />

      <div className="fila-pago total">
        <strong>Total a Pagar:</strong>
        <strong style={{ fontSize: '1.35rem', color: '#0f172a' }}>${formatear(total)}</strong>
      </div>
    </div>
  );
}
