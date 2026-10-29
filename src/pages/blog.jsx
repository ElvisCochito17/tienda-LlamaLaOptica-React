import "../css/blog.css";
import { Link } from "react-router-dom";
import { Tarjeta } from "../componentes/Tarjeta";
import { articulosData } from "../data/articulosData";

function Blog() {
  return (
    <main className="blog-container">
      {/* Sección Hero / Bienvenida */}
      <section className="blog-hero">
        <h1>Bienvenido a nuestro blog</h1>
        <p>
          En Llama la Óptica contamos con un servicio personalizado para ayudarte a encontrar los lentes que necesitas y mejorar tu experiencia visual diaria.
        </p>
      </section>

      {/* Sección principal de entradas */}
      <section className="info-blog">
        <div className="contenedor-tarjetas">
          {articulosData.map((articulo) => (
            <Link 
              key={articulo.id} 
              to={`/blog/${articulo.id}`} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Tarjeta className="tarjeta-blog">
                <div className="img-wrapper">
                  <img src={articulo.imagen} alt={articulo.titulo} />
                </div>
                <Tarjeta.Body>
                  <span className="categoria-badge">{articulo.categoria}</span>
                  <h4>{articulo.titulo}</h4>
                  <p className="meta">Por {articulo.autor} • {articulo.fecha}</p>
                  <p className="descripcion">{articulo.resumen}</p>
                </Tarjeta.Body>
              </Tarjeta>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Blog;