import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ItemCarrito } from '../ItemCarrito';

// id 99 no existe en data/productos.js, así que no tiene precio tachado de oferta
const producto = { id: 99, titulo: 'Lente de prueba', imagen: '/img/x.jpg', precio: 10000, cantidad: 2 };

describe('ItemCarrito', () => {
  test('muestra el título, la cantidad y el subtotal calculado', () => {
    render(<ItemCarrito producto={producto} onIncrementar={() => {}} onDecrementar={() => {}} onEliminar={() => {}} />);
    expect(screen.getByText('Lente de prueba')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    // 10.000 x 2 = 20.000 (el formato es-CL usa punto como separador de miles)
    expect(screen.getByText('$20.000')).toBeInTheDocument();
  });

  test('llama a los callbacks con el id del producto al hacer clic', async () => {
    const onIncrementar = vi.fn();
    const onDecrementar = vi.fn();
    const onEliminar = vi.fn();
    render(<ItemCarrito producto={producto} onIncrementar={onIncrementar} onDecrementar={onDecrementar} onEliminar={onEliminar} />);

    await userEvent.click(screen.getByRole('button', { name: '+' }));
    await userEvent.click(screen.getByRole('button', { name: '-' }));
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(onIncrementar).toHaveBeenCalledWith(99);
    expect(onDecrementar).toHaveBeenCalledWith(99);
    expect(onEliminar).toHaveBeenCalledWith(99);
  });
});
