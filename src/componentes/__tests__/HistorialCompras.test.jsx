import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HistorialCompras from '../HistorialCompras';

const usuario = { nombre: 'Ana Pérez', email: 'ana@correo.cl' };
const ordenes = [
  { id: 1001, fecha: '01-10-2026', estado: 'Pagado', total: 25000, productos: [{ cantidad: 2 }] },
  { id: 1002, fecha: '05-10-2026', estado: 'Entregado', total: 15000, productos: [{ cantidad: 1 }] },
];

// HistorialCompras usa <Link>, por eso hay que envolverlo en un Router
const mostrar = (props) =>
  render(
    <MemoryRouter>
      <HistorialCompras usuario={usuario} onCerrar={() => {}} {...props} />
    </MemoryRouter>
  );

describe('HistorialCompras', () => {
  test('lista las compras del usuario y el total gastado', () => {
    mostrar({ ordenes });
    expect(screen.getByText('Ana Pérez · ana@correo.cl')).toBeInTheDocument();
    expect(screen.getByText('#1001')).toBeInTheDocument();
    expect(screen.getByText('#1002')).toBeInTheDocument();
    expect(screen.getByText(/Total gastado: \$40\.000/)).toBeInTheDocument();
  });

  test('muestra un mensaje si no hay compras y permite cerrar la ventana', async () => {
    const onCerrar = vi.fn();
    mostrar({ ordenes: [], onCerrar });
    expect(screen.getByText('Este usuario aún no ha realizado compras.')).toBeInTheDocument();

    // hay dos botones "Cerrar" (la X del encabezado y el del pie): se usa el del pie
    const botonesCerrar = screen.getAllByRole('button', { name: 'Cerrar' });
    await userEvent.click(botonesCerrar[botonesCerrar.length - 1]);
    expect(onCerrar).toHaveBeenCalled();
  });
});
