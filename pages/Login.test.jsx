import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/login';

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Pruebas Unitarias - Login', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Testing 1: Muestra de alerta de error ante datos inválidos
  test('debe mostrar un mensaje de error si las credenciales no existen en localStorage', () => {
    renderWithRouter(<Login />);
    
    const inputEmail = screen.getByLabelText(/correo electrónico/i);
    const inputPassword = screen.getByLabelText(/contraseña/i);
    const btnIngresar = screen.getByRole('button', { name: /ingresar/i });

    fireEvent.change(inputEmail, { target: { value: 'error@correo.cl' } });
    fireEvent.change(inputPassword, { target: { value: '123456' } });
    fireEvent.click(btnIngresar);

    expect(screen.getByText(/correo o contraseña incorrectos/i)).toBeInTheDocument();
  });

  // Testing 2: Guardado de usuario activo tras login exitoso
  test('debe almacenar el usuario activo en localStorage al ingresar correctamente', () => {
    const usuariosSimulados = [{ email: 'admin@correo.cl', password: '123', rol: 'Administrador' }];
    localStorage.setItem('usuarios', JSON.stringify(usuariosSimulados));

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'admin@correo.cl' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    expect(usuarioActivo).toEqual(usuariosSimulados[0]);
  });
});