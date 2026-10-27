import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DetallePedido from './DetallePedido';

describe('Pruebas Unitarias - Vista DetallePedido', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Test 1: Orden no encontrada
  test('debe mostrar alerta cuando el ID de la ruta no existe en mis_ordenes', () => {
    render(
      <MemoryRouter initialEntries={['/pedido/9999']}>
        <Routes>
          <Route path="/pedido/:id" element={<DetallePedido />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/no se encontró el pedido/i)).toBeInTheDocument();
  });

  // Test 2: Carga correcta de boleta y detalle
  test('debe renderizar el detalle y la boleta cuando el ID coincide', () => {
    const ordenes = [
      {
        id: 9858,
        fecha: '26-10-2026',
        cliente: 'Vicente',
        direccion: 'Av. Providencia 1234',
        total: 20990,
        estado: 'Pagado',
        productos: [{ titulo: 'Lente Sencillo', cantidad: 1, precio: 20990 }]
      }
    ];
    localStorage.setItem('mis_ordenes', JSON.stringify(ordenes));

    render(
      <MemoryRouter initialEntries={['/pedido/9858']}>
        <Routes>
          <Route path="/pedido/:id" element={<DetallePedido />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/detalle del pedido #9858/i)).toBeInTheDocument();
    expect(screen.getByText(/boleta electrónica n° #9858/i)).toBeInTheDocument();
  });
});