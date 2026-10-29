import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tarjeta } from '../Tarjeta';

describe('Tarjeta', () => {
  test('renderiza a sus hijos dentro de la tarjeta', () => {
    render(
      <Tarjeta>
        <p>Contenido interno</p>
      </Tarjeta>
    );
    expect(screen.getByText('Contenido interno')).toBeInTheDocument();
  });

  test('agrega la clase personalizada recibida por props', () => {
    const { container } = render(<Tarjeta className="mi-clase">Hola</Tarjeta>);
    expect(container.firstChild).toHaveClass('tarjeta-generica', 'mi-clase');
  });
});
