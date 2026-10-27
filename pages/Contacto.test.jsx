import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Contacto from '../pages/contacto';

describe('Pruebas Unitarias - Formulario de Contacto', () => {
  // Testing 1: Actualización de los valores de entrada
  test('debe actualizar el campo de correo electrónico cuando el usuario escribe', () => {
    render(<Contacto />);
    const inputEmail = screen.getByPlaceholderText(/ingrese email/i);

    fireEvent.change(inputEmail, { target: { value: 'cliente@correo.cl' } });
    expect(inputEmail.value).toBe('cliente@correo.cl');
  });

  // Testing 2: Reseteo de formulario mediante el botón Limpiar
  test('debe vaciar todos los campos al presionar el botón Limpiar', () => {
    render(<Contacto />);
    const inputEmail = screen.getByPlaceholderText(/ingrese email/i);
    const btnLimpiar = screen.getByRole('button', { name: /limpiar/i });

    fireEvent.change(inputEmail, { target: { value: 'test@correo.cl' } });
    expect(inputEmail.value).toBe('test@correo.cl');

    fireEvent.click(btnLimpiar);
    expect(inputEmail.value).toBe('');
  });
});