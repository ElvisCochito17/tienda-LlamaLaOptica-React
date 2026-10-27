import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cabecera from './Cabecera';

const renderConRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Pruebas Unitarias - Componente Cabecera', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('debe renderizar los enlaces de navegación principales', () => {
    renderConRouter(<Cabecera />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /catalogo/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /pedidos/i })).toBeInTheDocument();
  });

  test('debe mostrar la cantidad acumulada de productos en la insignia del carrito', () => {
    const carritoSimulado = [
      { id: 1, cantidad: 2 },
      { id: 2, cantidad: 3 }
    ];
    localStorage.setItem('carrito', JSON.stringify(carritoSimulado));

    renderConRouter(<Cabecera />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});