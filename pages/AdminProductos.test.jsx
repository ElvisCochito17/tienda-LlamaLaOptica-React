import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminProductos from '../pages/adminproductos';

describe('Pruebas Unitarias - AdminProductos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Testing 1: Detección visual de stock crítico
  test('debe mostrar la insignia de stock crítico cuando las unidades son menores o iguales a 5', () => {
    const productosSimulados = [{ id: 1, titulo: 'Lente Prueba', precio: 10000, imagen: 'http://img.jpg', stock: 3 }];
    localStorage.setItem('productos_admin', JSON.stringify(productosSimulados));

    render(<AdminProductos />);
    expect(screen.getByText(/crítico: 3/i)).toBeInTheDocument();
  });

  // Testing 2: Eliminación de productos de la lista
  test('debe eliminar un producto del catálogo al hacer clic en el botón Eliminar', () => {
    const productosSimulados = [{ id: 99, titulo: 'Lente Borrar', precio: 10000, imagen: 'http://img.jpg', stock: 10 }];
    localStorage.setItem('productos_admin', JSON.stringify(productosSimulados));

    render(<AdminProductos />);
    expect(screen.getByText('Lente Borrar')).toBeInTheDocument();

    const btnEliminar = screen.getByRole('button', { name: /eliminar/i });
    fireEvent.click(btnEliminar);

    expect(screen.queryByText('Lente Borrar')).not.toBeInTheDocument();
  });
});