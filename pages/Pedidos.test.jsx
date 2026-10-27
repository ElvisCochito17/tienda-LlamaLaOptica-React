import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Pedidos from './Pedidos';

const renderConRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Pruebas Unitarias - Vista Pedidos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Test 1: Estado sin compras
  test('debe mostrar mensaje informando que no existen compras realizadas', () => {
    renderConRouter(<Pedidos />);
    expect(screen.getByText(/aún no has realizado ninguna compra/i)).toBeInTheDocument();
  });

  // Test 2: Listado de órdenes
  test('debe desplegar la tarjeta de la orden almacenada en mis_ordenes', () => {
    const misOrdenes = [
      { id: 1001, fecha: '26/10/2026', cliente: 'Gabriel Tapia', total: 20990, estado: 'Pagado' }
    ];
    localStorage.setItem('mis_ordenes', JSON.stringify(misOrdenes));

    renderConRouter(<Pedidos />);
    expect(screen.getByText(/orden #1001/i)).toBeInTheDocument();
    expect(screen.getByText('Pagado')).toBeInTheDocument();
  });
});