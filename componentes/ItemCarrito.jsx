import React from 'react';
import { productosLentes } from '../data/productos';

export function ItemCarrito({ producto, onIncrementar, onDecrementar, onEliminar }) {
  const formatearPrecio = (valor) => 
    typeof valor === 'number' ? valor.toLocaleString('es-CL') : valor;

  const precioUnitario = producto.precioNumero || producto.precio;
  const subtotal = precioUnitario * producto.cantidad;

  // Buscamos la info original del producto para rescatar el precio tachado si está en oferta
  const prodOriginal = productosLentes.find((p) => p.id === producto.id);
  const tieneOferta = prodOriginal && prodOriginal.enOferta && prodOriginal.precioOriginal;

  return (
    <div className="card-item-carrito">
      <div className="item-img-contenedor">
        <img src={producto.imagen} alt={producto.titulo} />
      </div>
      
      <div className="item-detalles-info">
        <h4>{producto.titulo}</h4>
        
        <div className="item-precio-unitario" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Precio unitario: <strong>${formatearPrecio(precioUnitario)}</strong></span>
          {tieneOferta && (
            <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.85rem' }}>
              {prodOriginal.precioOriginal}
            </span>
          )}
        </div>
        
        <div className="item-acciones-fila">
          <div className="control-cantidad-badge">
            <button 
              type="button" 
              onClick={() => onDecrementar(producto.id)}
            >
              -
            </button>
            <span>{producto.cantidad}</span>
            <button 
              type="button" 
              onClick={() => onIncrementar(producto.id)}
            >
              +
            </button>
          </div>
          
          <button 
            type="button"
            className="btn-eliminar-rojo"
            onClick={() => onEliminar(producto.id)}
          >
            Eliminar
          </button>
        </div>
      </div>
      
      <div className="item-subtotal-bloque">
        <span className="label-subtotal">Subtotal</span>
        <strong className="monto-subtotal">${formatearPrecio(subtotal)}</strong>
      </div>
    </div>
  );
}