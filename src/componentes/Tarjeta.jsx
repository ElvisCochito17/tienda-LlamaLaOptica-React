export function Tarjeta({ children, className = '' }) {
  return (
    <div className={`tarjeta-generica ${className}`}>
      {children}
    </div>
  );
}

Tarjeta.Header = function TarjetaHeader({ children, className = '' }) {
  return <div className={`tarjeta-header-bloque ${className}`}>{children}</div>;
};

Tarjeta.Body = function TarjetaBody({ children }) {
  return <div className="tarjeta-body-bloque">{children}</div>;
};

Tarjeta.Texto = function TarjetaTexto({ label, valor }) {
  return (
    <p className="tarjeta-texto-linea">
      <strong style={{ color: '#2e5a44' }}>{label}: </strong>{valor}
    </p>
  );
};