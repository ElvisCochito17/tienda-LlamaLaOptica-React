import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Pie from '../componentes/Pie';

describe('Pruebas Unitarias - Componente Pie', () => {
  // Testing 1: Verificación del texto de derechos de autor
  test('debe contener el texto de derechos reservados y el nombre de la tienda', () => {
    render(<Pie />);
    const pieTexto = screen.getByText(/2024 llama la optica\. todos los derechos reservados\./i);
    expect(pieTexto).toBeInTheDocument();
  });

  // Testing 2: Verificación del elemento footer HTML
  test('debe renderizarse dentro de un elemento semantic footer', () => {
    const { container } = render(<Pie />);
    const footerElement = container.querySelector('footer');
    expect(footerElement).not.toBeNull();
  });
});