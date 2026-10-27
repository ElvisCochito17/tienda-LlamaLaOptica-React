import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminOrdenes from '../pages/adminordenes';

describe('Pruebas Unitarias - AdminOrdenes', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Testing 1: Actualización de estado al presionar "Enviar"
  test('debe cambiar el estado del pedido a "Enviado" al presionar el botón de envío', () => {
    const ordenesSimuladas = [{ id: 101, cliente: 'Gabriel Tapia', fecha: '26/10/2026', total: 15000, estado: 'Pagado' }];
    localStorage.setItem('ordenes_admin', JSON.stringify(ordenesSimuladas));

    render(<AdminOrdenes />);

    const btnEnviar = screen.getByRole('button', { name: /📦 enviar/i });
    fireEvent.click(btnEnviar);

    expect(screen.getByText('Enviado')).toBeInTheDocument();
    expect(screen.getByText('✓ Gestionado')).toBeInTheDocument();
  });

  // Testing 2: Despliegue de datos por defecto cuando localStorage está vacío
  test('debe cargar y renderizar datos simulados cuando no existen órdenes en localStorage', () => {
    render(<AdminOrdenes />);
    expect(screen.getByText(/gabriel tapia/i)).toBeInTheDocument();
    expect(screen.getByText(/claudia vasquez/i)).toBeInTheDocument();
  });
});