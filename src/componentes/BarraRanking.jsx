// Lista de barras horizontales (Bootstrap "progress") para comparar valores.
// items: [{ etiqueta: 'Texto', valor: 10, texto: 'opcional a la derecha' }]
export default function BarraRanking({ titulo, items = [], color = 'primary', mensajeVacio = 'Sin datos para mostrar.' }) {
  const maximo = Math.max(...items.map((i) => i.valor), 0);

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-header bg-white fw-bold py-3">{titulo}</div>
      <div className="card-body">
        {items.length === 0 ? (
          <p className="text-muted small mb-0">{mensajeVacio}</p>
        ) : (
          items.map((item) => {
            const porcentaje = maximo > 0 ? Math.round((item.valor / maximo) * 100) : 0;
            return (
              <div key={item.etiqueta} className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-semibold">{item.etiqueta}</span>
                  <span className="text-muted">{item.texto ?? item.valor}</span>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div
                    className={`progress-bar bg-${color}`}
                    role="progressbar"
                    style={{ width: `${porcentaje}%` }}
                    aria-valuenow={porcentaje}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
