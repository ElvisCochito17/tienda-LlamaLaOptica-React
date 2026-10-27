import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../pages/admindashboard';

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Pruebas Unitarias - AdminDashboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Testing 1: Lectura y despliegue de métricas desde localStorage
  test('debe contabilizar y renderizar las métricas de usuarios, productos y órdenes', () => {
    localStorage.setItem('usuarios', JSON.stringify([{}, {}])); // 2 usuarios
    localStorage.setItem('productos_admin', JSON.stringify([{}, {}, {}])); // 3 productos
    localStorage.setItem('ordenes_admin', JSON.stringify([{}])); // 1 orden

    renderWithRouter(<AdminDashboard />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  // Testing 2: Despliegue de estado vacío cuando no hay compras
  test('debe mostrar mensaje indicando que no hay compras registradas si la lista está vacía', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByText(/aún no hay compras registradas/i)).toBeInTheDocument();
  });
});