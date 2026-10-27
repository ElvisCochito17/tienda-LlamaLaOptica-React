import { useParams, Link } from "react-router-dom";
import { articulosData } from "../data/articulosData";
import "../css/blog.css";

function DetalleBlog() {
  const { id } = useParams();
  const articulo = articulosData.find((art) => art.id === id);

  if (!articulo) {
    return (
      <main
        className="blog-container"
        style={{ textAlign: "center", padding: "3rem" }}
      >
        <h2>Artículo no encontrado</h2>
        <p>El artículo que estás buscando no existe o fue movido.</p>
        <Link to="/blog" className="btn-volver">
          Volver al Blog
        </Link>
      </main>
    );
  }

  return (
    <main className="blog-container">
      <article
        className="detalle-blog-contenido"
        style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}
      >
        <Link
          to="/blog"
          style={{
            textDecoration: "none",
            color: "#2e5a44",
            fontWeight: "bold",
          }}
        >
          ← Volver al Blog
        </Link>
        <h1 style={{ marginTop: "1rem" }}>{articulo.titulo}</h1>
        <p className="meta" style={{ color: "#666", marginBottom: "1.5rem" }}>
          Por {articulo.autor} • {articulo.fecha}
        </p>
        {/* Contenedor de la imagen corregido */}
        <div style={{ width: "100%", textAlign: "center", marginBottom: "2rem" }}>
          <img 
            src={articulo.imagen} 
            alt={articulo.titulo} 
            style={{ 
              maxWidth: "100%", 
              maxHeight: "450px", 
              objectFit: "contain", 
              borderRadius: "10px" 
            }} 
          />
        </div>
        <div
          className="cuerpo-articulo"
          style={{ lineHeight: "1.8", fontSize: "1.1rem", color: "#333" }}
        >
          {articulo.contenido.map((parrafo, idx) => (
            <p key={idx} style={{ marginBottom: "1.2rem" }}>
              {parrafo}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}

export default DetalleBlog;
