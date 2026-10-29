import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResumenOrden from '../ResumenOrden';

const productos = [
  { id: 1, titulo: 'Lente A', precio: 10000, cantidad: 2 },
  { id: 2, titulo: 'Lente B', precio: 5000, cantidad: 1 },
];

describe('ResumenOrden', () => {
  test('muestra una fila por producto con su subtotal', () => {
    render(<ResumenOrden productos={productos} />);
    expect(screen.getByText('Lente A')).toBeInTheDocument();
    expect(screen.getByText('Lente B')).toBeInTheDocument();
    expect(screen.getByText('$20.000')).toBeInTheDocument(); // 10.000 x 2
  });

  test('calcula el total si no se entrega, y respeta el total recibido por props', () => {
    const { rerender } = render(<ResumenOrden productos={productos} />);
    expect(screen.getByText('Total: $25.000')).toBeInTheDocument();

    rerender(<ResumenOrden productos={productos} total={99000} />);
    expect(screen.getByText('Total: $99.000')).toBeInTheDocument();
  });
});
