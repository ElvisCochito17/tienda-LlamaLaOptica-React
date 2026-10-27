import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productosLentes } from '../data/productos';
import { Tarjeta } from '../componentes/Tarjeta';
import '../css/detalle_producto.css';

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mostrarResumen, setMostrarResumen] = useState(false);

  // Buscar el producto por ID
  const producto = productosLentes.find((p) => p.id === parseInt(id));

  if (!producto) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>El producto no existe</h2>
        <Link to="/catalogo" className="btn-ver">Volver al catálogo</Link>
      </div>
    );
  }

  // Función para calcular el porcentaje real de descuento de forma exacta
  const calcularPorcentaje = (lente) => {
    if (lente.precioOriginalNumero && lente.precioNumero) {
      return Math.round(((lente.precioOriginalNumero - lente.precioNumero) / lente.precioOriginalNumero) * 100);
    }
    if (lente.precioOriginal) {
      const originalNum = parseInt(lente.precioOriginal.replace(/\D/g, ""));
      if (originalNum && originalNum > lente.precioNumero) {
        return Math.round(((originalNum - lente.precioNumero) / originalNum) * 100);
      }
    }
    return 15;
  };

  // Función para guardar en el carrito correctamente
  const agregarAlCarrito = () => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    const index = carritoActual.findIndex((item) => item.id === producto.id);

    const productoParaCarrito = {
      id: producto.id,
      titulo: producto.titulo,
      imagen: producto.imagen,
      precio: producto.precioNumero, // Usa el precio real rebajado
      cantidad: 1
    };

    if (index !== -1) {
      carritoActual[index].cantidad += 1;
    } else {
      carritoActual.push(productoParaCarrito);
    }

    localStorage.setItem('carrito', JSON.stringify(carritoActual));
    window.dispatchEvent(new Event('storage'));
    setMostrarResumen(true);
  };

  const comprarAhora = () => {
    agregarAlCarrito();
    navigate('/Carrito');
  };

  return (
    <main className="detalle-main-contenedor">
      <div className="volver-atras">
        <Link to="/catalogo" className="link-regresar">&lt; Volver al Catálogo</Link>
      </div>

      <div className="detalle-producto-grid">
        {/* Contenedor de la imagen con position relative explícito para que el badge no se mueva */}
        <div className="detalle-imagen-bloque" style={{ position: 'relative' }}>
          {producto.enOferta && (
            <span className="badge-oferta">
              -{calcularPorcentaje(producto)}% OFF
            </span>
          )}
          <img src={producto.imagen} alt={producto.titulo} />
        </div>

        <div className="detalle-info-bloque">
          <span className="categoria-tag">{producto.enOferta ? 'Oferta Especial' : 'Nueva Colección'}</span>
          <h1>{producto.titulo}</h1>
          
          <div className="detalle-precio-container" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p className="detalle-precio" style={{ margin: 0 }}>
              ${producto.precioNumero.toLocaleString('es-CL')}
            </p>
            {producto.enOferta && producto.precioOriginal && (
              <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '1.2rem', fontWeight: '600' }}>
                {producto.precioOriginal}
              </span>
            )}
          </div>

          <div className="detalle-descripcion">
            <h3>Descripción</h3>
            <p>{producto.descripcionLarga}</p>
          </div>

          <div className="ficha-tecnica-contenedor">
            <h3 className="titulo-ficha">Especificaciones Técnicas</h3>
            <Tarjeta>
              <Tarjeta.Body>
                {producto.detalles.map((det, idx) => (
                  <Tarjeta.Texto key={idx} label={det.label} valor={det.valor} />
                ))}
              </Tarjeta.Body>
            </Tarjeta>
          </div>

          <div className="detalle-acciones">
            <button className="btn-anadir-grande" onClick={agregarAlCarrito}>
              Añadir al Carrito
            </button>
            <button className="btn-cotizar-grande" onClick={comprarAhora}>
              Ir a Pagar
            </button>
          </div>
        </div>
      </div>

      {/* Modal flotante al añadir */}
      {mostrarResumen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="modal-contenido" style={{
            background: '#fff', padding: '30px', borderRadius: '10px', textAlign: 'center', maxWidth: '400px', width: '90%', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ color: '#27ae60', marginBottom: '15px', fontSize: '1.1rem' }}>
              ¡Producto agregado con éxito! Puedes seguir comprando o dirigirte al carrito para continuar.
            </h3> 
            <img src={producto.imagen} alt={producto.titulo} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
            
            <h4 style={{ margin: '10px 0' }}>{producto.titulo}</h4>
            <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Precio: ${producto.precioNumero.toLocaleString('es-CL')}</p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setMostrarResumen(false)} 
                style={{ flex: 1, padding: '10px', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Seguir Comprando
              </button>
              <Link 
                to="/Carrito" 
                style={{ flex: 1, padding: '10px', background: '#000', color: '#fff', textDecoration: 'none', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
              >
                Ver Carrito
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default DetalleProducto;