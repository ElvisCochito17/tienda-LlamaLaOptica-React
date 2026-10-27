import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tarjeta } from '../componentes/Tarjeta';

describe('Pruebas Unitarias - Componente Tarjeta', () => {
  // Testing 1: Renderizado de contenido hijo en Tarjeta.Body
  test('debe renderizar correctamente los elementos hijos dentro de Tarjeta.Body', () => {
    render(
      <Tarjeta>
        <Tarjeta.Body>
          <h4>Lentes de Sol Aviador</h4>
        </Tarjeta.Body>
      </Tarjeta>
    );

    const titulo = screen.getByRole('heading', { level: 4, name: /lentes de sol aviador/i });
    expect(titulo).toBeInTheDocument();
  });

  // Testing 2: Formato y renderizado del subcomponente Tarjeta.Texto
  test('debe renderizar la etiqueta y el valor en Tarjeta.Texto', () => {
    render(<Tarjeta.Texto label="Material" valor="Metal resistente" />);

    const etiqueta = screen.getByText(/material:/i);
    const valor = screen.getByText(/metal resistente/i);

    expect(etiqueta).toBeInTheDocument();
    expect(valor).toBeInTheDocument();
  });
});