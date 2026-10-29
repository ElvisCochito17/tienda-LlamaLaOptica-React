import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TarjetaMetrica from '../TarjetaMetrica';

describe('TarjetaMetrica', () => {
  test('muestra el título y el valor recibidos por props', () => {
    render(<TarjetaMetrica titulo="Compras" valor={12} />);
    expect(screen.getByText('Compras')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  test('renderiza el detalle extra (children) y ajusta el color del texto', () => {
    const { container } = render(
      <TarjetaMetrica titulo="Usuarios" valor={3} color="warning">
        <span>Detalle extra</span>
      </TarjetaMetrica>
    );
    expect(screen.getByText('Detalle extra')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-warning', 'text-dark');
  });
});
