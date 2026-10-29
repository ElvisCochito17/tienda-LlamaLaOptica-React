import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BarraRanking from '../BarraRanking';

describe('BarraRanking', () => {
  test('renderiza una barra por cada elemento y calcula el porcentaje sobre el máximo', () => {
    const items = [
      { etiqueta: 'Lente A', valor: 10 },
      { etiqueta: 'Lente B', valor: 5 },
    ];
    render(<BarraRanking titulo="Más vendidos" items={items} />);

    expect(screen.getByText('Lente A')).toBeInTheDocument();
    expect(screen.getByText('Lente B')).toBeInTheDocument();
    const barras = screen.getAllByRole('progressbar');
    expect(barras).toHaveLength(2);
    expect(barras[0]).toHaveAttribute('aria-valuenow', '100');
    expect(barras[1]).toHaveAttribute('aria-valuenow', '50');
  });

  test('muestra el mensaje de vacío cuando no hay datos', () => {
    render(<BarraRanking titulo="Más vendidos" items={[]} mensajeVacio="Aún no hay ventas." />);
    expect(screen.getByText('Aún no hay ventas.')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
