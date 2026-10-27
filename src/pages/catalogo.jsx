import { useState } from "react";
import { Tarjeta } from "../componentes/Tarjeta";
import { Link } from "react-router-dom";
import { productosLentes } from "../data/productos";
import "../css/catalogo.css";

function Catalogo() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos");
  const [productoAgregadoModal, setProductoAgregadoModal] = useState(null);

  const agregarAlCarrito = (lente) => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carritoActual.findIndex((item) => item.id === lente.id);

    const productoParaCarrito = {
      id: lente.id,
      titulo: lente.titulo,
      imagen: lente.imagen,
      precio: lente.precioNumero, // Usa el precio real rebajado
      cantidad: 1,
    };

    if (index !== -1) {
      carritoActual[index].cantidad += 1;
    } else {
      carritoActual.push(productoParaCarrito);
    }

    localStorage.setItem("carrito", JSON.stringify(carritoActual));
    window.dispatchEvent(new Event("storage"));
    setProductoAgregadoModal(lente);
  };

  // Función para calcular el porcentaje real de descuento de forma infalible
  const calcularPorcentaje = (lente) => {
    // Si ya tienes un número de precio original en tus datos, lo usamos
    if (lente.precioOriginalNumero && lente.precioNumero) {
      return Math.round(
        ((lente.precioOriginalNumero - lente.precioNumero) /
          lente.precioOriginalNumero) *
          100,
      );
    }

    // Si viene como texto (ej: "$29.990")
    if (lente.precioOriginal) {
      const originalNum = parseInt(lente.precioOriginal.replace(/\D/g, ""));
      if (originalNum && originalNum > lente.precioNumero) {
        return Math.round(
          ((originalNum - lente.precioNumero) / originalNum) * 100,
        );
      }
    }

    return 15; // Por defecto
  };

  // Filtrado por categoría
  const productosFiltrados = productosLentes.filter((lente) => {
    if (categoriaSeleccionada === "todos") return true;
    if (categoriaSeleccionada === "mujer")
      return lente.titulo.toLowerCase().includes("mujer");
    if (categoriaSeleccionada === "hombre")
      return lente.titulo.toLowerCase().includes("hombre");
    if (categoriaSeleccionada === "sol")
      return lente.titulo.toLowerCase().includes("sol");
    if (categoriaSeleccionada === "opticos")
      return !lente.titulo.toLowerCase().includes("sol");
    return true;
  });

  // Filtra automáticamente los que estén en oferta para la sección destacada
  const productosOferta = productosLentes.filter((lente) => lente.enOferta);

  return (
    <main className="catalogo-wrapper">
      {/* HEADER DEL CATÁLOGO */}
      <header className="catalogo-header">
        <div className="catalogo-header-info">
          <span className="badge-subtitulo">Llama la Óptica</span>
          <h1>Catálogo Exclusivo</h1>
          <p>
            Explora nuestra variedad de lentes ópticos y de sol fabricados con
            materiales de alta gama y diseño ergonómico.
          </p>
        </div>

        <div className="filtro-categoria-box">
          <label htmlFor="select-categoria">Filtrar por categoría:</label>
          <select
            id="select-categoria"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="select-custom"
          >
            <option value="todos">Todas las categorías</option>
            <option value="mujer">Lentes de Mujer</option>
            <option value="hombre">Lentes de Hombre</option>
            <option value="sol">Lentes de Sol</option>
            <option value="opticos">Lentes Ópticos</option>
          </select>
        </div>
      </header>

      {/* SECCIÓN DE OFERTAS DESTACADAS */}
      {productosOferta.length > 0 && (
        <section className="seccion-ofertas">
          <div className="ofertas-header">
            <h2>🔥 Ofertas Especiales</h2>
            <p>Aprovecha descuentos exclusivos por tiempo limitado</p>
          </div>

          <div className="grid-productos-catalogo">
            {productosOferta.map((lente) => (
              <Tarjeta
                key={`oferta-${lente.id}`}
                className="tarjeta-lente-card"
              >
                {lente.enOferta && (
                  <span className="badge-oferta">
                    -{calcularPorcentaje(lente)}% OFF
                  </span>
                )}

                <Link to={`/producto/${lente.id}`} className="tarjeta-img-link">
                  <div className="img-frame">
                    <img src={lente.imagen} alt={lente.titulo} />
                  </div>
                </Link>

                <Tarjeta.Body>
                  <Link
                    to={`/producto/${lente.id}`}
                    className="tarjeta-titulo-link"
                  >
                    <h4>{lente.titulo}</h4>
                  </Link>

                  <div className="precio-container">
                    <span className="precio-oferta">
                      ${lente.precioNumero.toLocaleString("es-CL")}
                    </span>
                    {lente.precioOriginal && (
                      <span className="precio-tachado">
                        {lente.precioOriginal}
                      </span>
                    )}
                  </div>

                  <div className="acciones-tarjeta-compacta">
                    <Link
                      to={`/producto/${lente.id}`}
                      className="btn-ver-mas-compacto"
                    >
                      Ver Detalles
                    </Link>
                    <button
                      className="btn-carrito-principal"
                      onClick={() => agregarAlCarrito(lente)}
                    >
                      + Añadir
                    </button>
                  </div>
                </Tarjeta.Body>
              </Tarjeta>
            ))}
          </div>
        </section>
      )}

      {/* SECCIÓN PRINCIPAL DEL CATÁLOGO */}
      <section className="seccion-catalogo-general">
        <div className="catalogo-titulo-seccion">
          <h2>Todos los Productos</h2>
          <span className="contador-productos">
            ({productosFiltrados.length} disponibles)
          </span>
        </div>

        <div className="grid-productos-catalogo">
          {productosFiltrados.map((lente) => (
            <Tarjeta key={lente.id} className="tarjeta-lente-card">
              
              {lente.enOferta && (
                  <span className="badge-oferta">
                    -{calcularPorcentaje(lente)}% OFF
                  </span>
                )}

              <Link to={`/producto/${lente.id}`} className="tarjeta-img-link">
                <div className="img-frame">
                  <img src={lente.imagen} alt={lente.titulo} />
                </div>
              </Link>

              <Tarjeta.Body>
                <Link
                  to={`/producto/${lente.id}`}
                  className="tarjeta-titulo-link"
                >
                  <h4>{lente.titulo}</h4>
                </Link>

                <div className="precio-container">
                  <span
                    className={
                      lente.enOferta ? "precio-oferta" : "precio-normal"
                    }
                  >
                    ${lente.precioNumero.toLocaleString("es-CL")}
                  </span>
                  {lente.enOferta && lente.precioOriginal && (
                    <span className="precio-tachado">
                      {lente.precioOriginal}
                    </span>
                  )}
                </div>

                <div className="acciones-tarjeta-compacta">
                  <Link
                    to={`/producto/${lente.id}`}
                    className="btn-ver-mas-compacto"
                  >
                    Ver Detalles
                  </Link>
                  <button
                    className="btn-carrito-principal"
                    onClick={() => agregarAlCarrito(lente)}
                  >
                    + Añadir
                  </button>
                </div>
              </Tarjeta.Body>
            </Tarjeta>
          ))}
        </div>
      </section>

      {/* MODAL FLOTANTE DE CONFIRMACIÓN */}
      {productoAgregadoModal && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h3 className="modal-titulo-exito">
              ¡Producto agregado con éxito! Puedes seguir comprando o dirigirte
              al carrito para continuar.
            </h3>
            <img
              src={productoAgregadoModal.imagen}
              alt={productoAgregadoModal.titulo}
              className="modal-img-prod"
            />

            <h4 className="modal-prod-nombre">
              {productoAgregadoModal.titulo}
            </h4>
            <p className="modal-prod-precio">
              Precio: $
              {productoAgregadoModal.precioNumero.toLocaleString("es-CL")}
            </p>

            <div className="modal-botones-flex">
              <button
                onClick={() => setProductoAgregadoModal(null)}
                className="btn-modal-secundario"
              >
                Seguir Comprando
              </button>
              <Link to="/Carrito" className="btn-modal-principal">
                Ver Carrito
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Catalogo;
