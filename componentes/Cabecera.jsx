import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/Estilos.css';

function Cabecera() {
  const [totalItems, setTotalItems] = useState(0);
  const location = useLocation();

  const calcularTotal = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const cuenta = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    setTotalItems(cuenta);
  };

  useEffect(() => {
    // Calcular al cargar y al cambiar de página
    calcularTotal();

    // Escuchar eventos personalizados cuando se modifica el carrito
    window.addEventListener('carritoActualizado', calcularTotal);
    window.addEventListener('storage', calcularTotal); // Por si se abre en otra pestaña

    return () => {
      window.removeEventListener('carritoActualizado', calcularTotal);
      window.removeEventListener('storage', calcularTotal);
    };
  }, [location])
  return (
    <>
      <nav>
        <div className="marca">
          <img src='/img/logo.png' alt="Logo de la tienda" className="logo" />
          <span>Llama la Optica</span>
        </div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/catalogo">Catalogo</Link>
          </li>
          <li>
            <Link to="/quienes_somos">Quienes Somos</Link>
          </li>
          <li>
            <Link to="/contacto">Contacto</Link>
          </li>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          <li>
            <Link to="/pedidos">Pedidos</Link>
          </li>
          <li>
            <Link to="/registro">Registro</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/carrito" className="btn-carrito-nav">
              🛒 Carrito <span className="badge">{totalItems}</span> {/* <--- Aquí se ocupa */}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Cabecera;