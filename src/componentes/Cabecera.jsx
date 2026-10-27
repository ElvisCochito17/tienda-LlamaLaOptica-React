import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/Estilos.css';  

function Cabecera() {
  const [totalItems, setTotalItems] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const calcularTotal = () => {
      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      const cuenta = carrito.reduce((acc, item) => acc + item.cantidad, 0);
      setTotalItems(cuenta);
    };

    calcularTotal();
    }, [location]);

  return (
    <nav>
      <div className="marca">
        <img src='/img/logo.png' alt="Logo de la tienda" className="logo" />
        <span>Llama la Optica</span>
      </div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/catalogo">Catalogo</Link></li>
        <li><Link to="/quienes_somos">Quienes Somos</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/pedido">Pedidos</Link></li>
        <li>
          <Link to="/Carrito" className="btn-carrito-nav">
            🛒 Carrito{" "}
            <span id="contador-carrito" className="badge">
              {totalItems}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Cabecera;