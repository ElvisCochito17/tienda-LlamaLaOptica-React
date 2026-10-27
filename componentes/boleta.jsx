import React, { useState, useEffect } from 'react';
import '../css/boleta.css';

const Boleta = () => {
  const [carrito, setCarrito] = useState([]);
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [totalGeneral, setTotalGeneral] = useState(0);

  useEffect(() => {
    const rawData = JSON.parse(localStorage.getItem('nombresLentes')) || [];
    
    const productosNormalizados = rawData.map(item => {
      if (typeof item === 'object' && item !== null) {
        return {
          nombre: item.nombre || 'Lente de catálogo',
          precio: Number(item.precio) || 29990
        };
      }
      return {
        nombre: item,
        precio: 29990
      };
    });

    const sub = productosNormalizados.reduce((acc, item) => acc + item.precio, 0);
    const envio = productosNormalizados.length > 0 ? 2990 : 0;

    setCarrito(productosNormalizados);
    setCostoEnvio(envio);
    setTotalGeneral(sub + envio);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const fechaActual = new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="boleta-contenedor">
      <div className="boleta-cabecera">
        <h1>Llama la Optica</h1>
        <p>
          RUT: 76.543.210-K<br />
          Av. Los Lentes 123, Santiago
        </p>
        <div className="boleta-numero">
          <strong>BOLETA ELECTRÓNICA N° 10024</strong><br />
          Fecha: {fechaActual}
        </div>
      </div>

      <table className="boleta-tabla">
        <thead>
          <tr>
            <th>Cant.</th>
            <th>Descripción (Catálogo)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {carrito.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>No hay productos cargados.</td>
            </tr>
          ) : (
            <>
              {carrito.map((prod, index) => (
                <tr key={index}>
                  <td>1</td>
                  <td>{prod.nombre}</td>
                  <td>$ {prod.precio.toLocaleString('es-CL')}</td>
                </tr>
              ))}
              {costoEnvio > 0 && (
                <tr>
                  <td>1</td>
                  <td>Costo de Envío</td>
                  <td>$ {costoEnvio.toLocaleString('es-CL')}</td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>

      <div className="boleta-totales">
        <strong>TOTAL: $ {totalGeneral.toLocaleString('es-CL')}</strong>
      </div>

      <div className="boleta-pie">
        <p>Gracias por tu compra en Llama la Optica.</p>
        <button type="button" className="btn-imprimir" onClick={handlePrint}>
          Guardar como PDF o Imprimir
        </button>
      </div>
    </div>
  );
};

export default Boleta;