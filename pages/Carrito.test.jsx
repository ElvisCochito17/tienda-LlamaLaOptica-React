import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Carrito from './carrito';

const renderConRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Pruebas Unitarias - Vista Carrito', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Test 1: Estado vacío
  test('debe mostrar el mensaje de carrito vacío si no hay productos guardados', () => {
    renderConRouter(<Carrito />);
    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
  });

  // Test 2: Renderizado de productos
  test('debe desplegar los artículos almacenados en localStorage', () => {
    const productosSimulados = [
      { id: 1, titulo: 'Lente Sol Aviador', precio: 25000, cantidad: 1, imagen: '/img/Lentes1.jpg' }
    ];
    localStorage.setItem('carrito', JSON.stringify(productosSimulados));

    renderConRouter(<Carrito />);
    expect(screen.getByText('Lente Sol Aviador')).toBeInTheDocument();
  });
});