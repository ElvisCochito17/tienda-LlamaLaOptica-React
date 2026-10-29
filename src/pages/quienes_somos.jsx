import "../css/quienes_somos.css";
import { Button } from "react-bootstrap";
import { Alert } from "react-bootstrap";

function Quienes_somos() {
  return (
    <>
      <main>
        {/* <!-- Titulo y descripcion breve de la empresa-->  */}
        <section className="info-empresa">
          <h2>Sobre Nosotros</h2>
          <p>
            Somos una empresa dedicada a la venta de lentes de alta calidad,
            ofreciendo una amplia variedad de estilos y diseños para satisfacer
            las necesidades de nuestros clientes. En MonkeyHandsomeStudios,
            buscamos llevar la mejor visión directamente a ti.
          </p>
        </section>

        {/* <!-- Uso de clases para los perfiles de desarrolladores y sus respectivas tarjetas de presentación -->  */}
        <section className="info-desarrolladores">
          <h2>El Equipo de Desarrollo</h2>
          <div className="contenedor-perfiles">
            {/* <!-- Perfil 1 -->  */}
            <div className="perfil">
              <h4>Gabriel Tapia</h4>
              <img src="img/yamcha.png" alt="" />
              <p>
                Estudiante de Ingeniería en Informática en Duoc UC. Apasionado
                por la tecnología, los videojuegos, las carreras y el desarrollo
                de software. La imagen representa el estado actual del
                desarrollador.
              </p>
            </div>
            {/* <!-- Perfil 2 -->  */}
            <div className="perfil">
              <h4>Vicente Flores</h4>
              <img src="img/pepsiman.png" alt="Vicente Flores" />
              <p>
                Estudiante de Ingeniería en Informática en Duoc UC. Apasionado
                por el anime, musica, los videojuegos y la programación web, mas
                conocido como Pepsiman en las sombras salvando a Ciudad Pepsi.
              </p>
            </div>
            {/* <!-- Perfil 3 -->  */}
            <div className="perfil">
              <h4>Vicente Muñoz</h4>
              <img src="img/monachina.png" alt="Vicente Muñoz" />
              <p>
                Estudiante de Ingeniería en Informática en Duoc UC. Apasionado
                por el desarrollo de software, la inteligencia artificial y con
                metas de ponerle a su hijo "Sixe" para que cuando lo tenga que
                llamar le diga "Sixe ven"
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Quienes_somos;
