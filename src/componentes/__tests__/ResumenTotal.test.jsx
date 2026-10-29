import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResumenTotal } from '../ResumenTotal';

describe('ResumenTotal', () => {
  test('muestra el subtotal y el total formateados', () => {
    render(<ResumenTotal subtotal={30000} total={30000} />);
    expect(screen.getAllByText('$30.000')).toHaveLength(2); // subtotal y total
  });

  test('muestra la fila de descuento solo cuando hay descuento (renderizado condicional)', () => {
    const { rerender } = render(<ResumenTotal subtotal={30000} descuento={10000} total={20000} />);
    expect(screen.getByText('Descuentos aplicados:')).toBeInTheDocument();
    expect(screen.getByText('-$10.000')).toBeInTheDocument();

    rerender(<ResumenTotal subtotal={30000} descuento={0} total={30000} />);
    expect(screen.queryByText('Descuentos aplicados:')).not.toBeInTheDocument();
  });
});
