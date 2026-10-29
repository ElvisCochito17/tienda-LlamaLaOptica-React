import React from 'react';
import { Link } from 'react-router-dom';
import { Tarjeta } from '../componentes/Tarjeta';
import { productosLentes } from '../data/productos';
import '../css/home.css';

export default function Home() {
  // Tomamos los primeros 3 productos para mostrarlos destacados en el index
  const productosDestacados = productosLentes.slice(0, 3);

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

  return (
    <main className="home-container">
      {/* 1. HERO / BANNER DE BIENVENIDA */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Estilo & Salud Visual</span>
          <h1>Bienvenido a Llama la Óptica</h1>
          <p>
            En Llama la óptica contamos con un servicio personalizado para ayudarte a encontrar los lentes que necesitas y mejorar tu experiencia en el uso diario.
          </p>
          <div className="hero-buttons">
            <Link to="/catalogo" className="btn-catalogo">
              Ver Catálogo Completo
            </Link>
            <Link to="/quienes_somos" className="btn-nosotros">
              Conócenos
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN DE VENTAJAS / BENEFICIOS */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon"></div>
          <h3>Asesoría Personalizada</h3>
          <p>Te guiamos en la elección según la forma de tu rostro y tu medida exacta.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"></div>
          <h3>Calidad Garantizada</h3>
          <p>Materiales de alta durabilidad y cristales con protección UV certificada.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"></div>
          <h3>Despacho a Domicilio</h3>
          <p>Recibe tus lentes listos para usar directamente en la comodidad de tu hogar.</p>
        </div>
      </section>

      {/* 3. PRODUCTOS DESTACADOS CON TU COMPONENTE TARJETA */}
      <section className="destacados-section">
        <div className="section-title">
          <h2>Productos Destacados</h2>
          <p>Descubre algunas de nuestras opciones más populares seleccionadas para ti</p>
        </div>

        <div className="contenedor-tarjetas">
          {productosDestacados.map((prod) => (
            <Tarjeta key={prod.id} className="tarjeta-lentes-home">
              
              {/* Contenedor de la imagen con position: relative para anclar el badge de oferta */}
              <div className="tarjeta-img-wrapper" style={{ position: 'relative' }}>
                {prod.enOferta && (
                  <span className="badge-oferta">
                    -{calcularPorcentaje(prod)}% OFF
                  </span>
                )}
                <img src={prod.imagen} alt={prod.titulo} />
              </div>

              <Tarjeta.Body>
                <h3 className="tarjeta-titulo">{prod.titulo}</h3>
                
                <div className="precio-container" style={{ margin: '8px 0' }}>
                  <span className={prod.enOferta ? "precio-oferta" : "tarjeta-precio"} style={{ fontWeight: 'bold' }}>
                    Precio: ${prod.precioNumero.toLocaleString('es-CL')}
                  </span>
                  {prod.enOferta && prod.precioOriginal && (
                    <span className="precio-tachado" style={{ marginLeft: '10px', textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.9rem' }}>
                      {prod.precioOriginal}
                    </span>
                  )}
                </div>

                <p className="tarjeta-descripcion">{prod.descripcionCorta}</p>

                <div className="tarjeta-detalles-box">
                  {prod.detalles.map((detalle, index) => (
                    <Tarjeta.Texto
                      key={index}
                      label={detalle.label}
                      valor={detalle.valor}
                    />
                  ))}
                </div>

                <Link to={`/producto/${prod.id}`} className="btn-ver-mas">
                  Ver más
                </Link>
              </Tarjeta.Body>
            </Tarjeta>
          ))}
        </div>
      </section>
    </main>
  );
}