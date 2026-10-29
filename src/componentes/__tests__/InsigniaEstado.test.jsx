import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import InsigniaEstado from '../InsigniaEstado';

describe('InsigniaEstado', () => {
  test('muestra el texto del estado recibido', () => {
    render(<InsigniaEstado estado="Enviado" />);
    expect(screen.getByText('Enviado')).toBeInTheDocument();
  });

  test('usa el color según el estado y un gris para estados desconocidos', () => {
    const { rerender } = render(<InsigniaEstado estado="Entregado" />);
    expect(screen.getByText('Entregado')).toHaveClass('bg-success');

    rerender(<InsigniaEstado estado="Cancelado" />);
    expect(screen.getByText('Cancelado')).toHaveClass('bg-secondary');
  });
});
