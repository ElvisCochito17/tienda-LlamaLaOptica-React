import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResumenTotal } from '../componentes/ResumenTotal';

describe('Pruebas Unitarias - ResumenTotal', () => {
  // Testing 1: Renderizado del subtotal y total formateados
  test('debe renderizar el subtotal y el total formateados en pesos chilenos', () => {
    render(<ResumenTotal subtotal={30000} descuento={0} total={30000} />);

    expect(screen.getByText(/\$30\.000/i)).toBeInTheDocument();
    expect(screen.getByText(/envío:/i)).toBeInTheDocument();
    expect(screen.getByText(/gratis/i)).toBeInTheDocument();
  });

  // Testing 2: Renderizado condicional del descuento
  test('debe mostrar la fila de descuentos únicamente si descuento es mayor a 0', () => {
    const { rerender } = render(<ResumenTotal subtotal={30000} descuento={0} total={30000} />);
    expect(screen.queryByText(/descuentos aplicados:/i)).not.toBeInTheDocument();

    rerender(<ResumenTotal subtotal={30000} descuento={5000} total={25000} />);
    expect(screen.getByText(/descuentos aplicados:/i)).toBeInTheDocument();
    expect(screen.getByText(/-\$5\.000/i)).toBeInTheDocument();
  });
});