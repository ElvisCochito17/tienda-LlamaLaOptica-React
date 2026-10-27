import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ItemCarrito } from '../componentes/ItemCarrito';

describe('Pruebas Unitarias - ItemCarrito', () => {
  const productoBase = {
    id: 1,
    titulo: 'Lentes Clásicos',
    precio: 20000,
    cantidad: 2,
    imagen: '/img/lentes.jpg'
  };

  // Testing 1: Cálculo del subtotal por producto
  test('debe desplegar el título del producto y el subtotal calculado', () => {
    render(
      <ItemCarrito 
        producto={productoBase} 
        onIncrementar={vi.fn()} 
        onDecrementar={vi.fn()} 
        onEliminar={vi.fn()} 
      />
    );

    expect(screen.getByText('Lentes Clásicos')).toBeInTheDocument();
    expect(screen.getByText(/\$40\.000/i)).toBeInTheDocument(); // 20000 * 2
  });

  // Testing 2: Disparo de eventos al interactuar con botones
  test('debe llamar a las funciones onIncrementar y onEliminar al hacer clic', () => {
    const onIncrementarMock = vi.fn();
    const onEliminarMock = vi.fn();

    render(
      <ItemCarrito 
        producto={productoBase} 
        onIncrementar={onIncrementarMock} 
        onDecrementar={vi.fn()} 
        onEliminar={onEliminarMock} 
      />
    );

    const btnIncrementar = screen.getByRole('button', { name: '+' });
    const btnEliminar = screen.getByRole('button', { name: /eliminar/i });

    fireEvent.click(btnIncrementar);
    expect(onIncrementarMock).toHaveBeenCalledWith(1);

    fireEvent.click(btnEliminar);
    expect(onEliminarMock).toHaveBeenCalledWith(1);
  });
});