import "../css/blog.css";
import { Link } from "react-router-dom";
import { Tarjeta } from "../componentes/Tarjeta"; // Ajusta la ruta según donde tengas tu componente

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

     {/* Tarjeta 1 */}
     <Tarjeta className="tarjeta-blog">
      <div className="img-wrapper">
       <img src="/img/blog1.jpg" alt="Cuidado de lentes" />
      </div>
      <Tarjeta.Body>
       <span className="categoria-badge">Artículos</span>
       <h4>Cómo Elegir entre Lentes Progresivos y Bifocales</h4>
       <p className="meta">Por Admin • 28 Oct, 2024</p>
       <p className="descripcion">
        La elección entre lentes progresivos y bifocales es una decisión importante para una correcta salud visual diaria.
       </p>
      </Tarjeta.Body>
     </Tarjeta>

     {/* Tarjeta 2 */}
     <Tarjeta className="tarjeta-blog">
      <div className="img-wrapper">
       <img src="/img/blog2.jpg" alt="Atención óptica" />
      </div>
      <Tarjeta.Body>
       <span className="categoria-badge">Artículos</span>
       <h4>¿Qué se hace en una óptica?</h4>
       <p className="meta">Por Admin • 9 Jun, 2024</p>
       <p className="descripcion">
        En una óptica se brinda mucho más que solo lentes: entregamos asesoramiento personalizado para la salud de tu visión.
       </p>
      </Tarjeta.Body>
     </Tarjeta>

     {/* Tarjeta 3 */}
     <Tarjeta className="tarjeta-blog">
      <div className="img-wrapper">
       <img src="/img/Lentes3.jpg" alt="Ópticas Santiago" />
      </div>
      <Tarjeta.Body>
       <span className="categoria-badge">Artículos</span>
       <h4>¿Cómo es la calidad de nuestros lentes?</h4>
       <p className="meta">Por Admin • 4 Jun, 2024</p>
       <p className="descripcion">
        Nuestra óptica trabaja con los mejores laboratorios que cuentan con materiales de fabricación de alta calidad.
       </p>
      </Tarjeta.Body>
     </Tarjeta>
    </div>

    {/* Bloque de Impacto Ambiental */}
    <section className="impacto-ambiental">
     <div className="impacto-box">
      <p>
       En nuestra empresa, nos preocupamos por el impacto ambiental de nuestras operaciones. Si quieres saber más acerca de nuestras iniciativas sostenibles, haz clic a continuación.
      </p>
      <Link to="/impacto_ambiental" className="btn-impacto">
       Conocer Impacto Ambiental
      </Link>
     </div>
    </section>
   </section>
  </main>
 );
}
export default Blog;