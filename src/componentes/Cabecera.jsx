import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/estilos.css';

function Cabecera() {
  const [totalItems, setTotalItems] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const calcularTotal = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const cuenta = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    setTotalItems(cuenta);
  };

  const verificarSesion = () => {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioActivo'));
    setUsuario(usuarioGuardado);
  };

  useEffect(() => {
    calcularTotal();
    verificarSesion();

    window.addEventListener('storage', calcularTotal);
    window.addEventListener('storage', verificarSesion); 

    return () => {
      window.removeEventListener('storage', calcularTotal);
      window.removeEventListener('storage', verificarSesion);
    };
  }, [location])

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioActivo'); 
    setUsuario(null); 
    navigate('/'); 
  };
  
  return (
    <>
      <nav>
        <div className="marca">
          <Link to="/">
            <img 
              src='/img/Logo2.jpg' 
              alt="Llama la Optica" 
              className="logo" 
              style={{ height: '80px', objectFit: 'contain' }} 
            />
          </Link>
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
          
          {usuario ? (
            <>
              {/* Acceso al panel de administración: solo lo ve el administrador */}
              {usuario.rol === 'Administrador' && (
                <li>
                  <Link to="/admin" className="btn-admin-nav">Panel Admin</Link>
                </li>
              )}
              <li>
                <Link to="/perfil">Mi Perfil</Link>
              </li>
              <li>
                {/* Ahora es un enlace normal para que tome los estilos de CSS */}
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault(); // Evita que recargue la página
                    cerrarSesion();
                  }}
                >
                  Cerrar Sesión
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/registro">Registro</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}

          <li>
            <Link to="/carrito" className="btn-carrito-nav">
              🛒Carrito <span className="badge">{totalItems}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Cabecera;