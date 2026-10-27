import { describe, test, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Custom Hook simulado
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  return { count, increment, decrement };
}

describe('Pruebas Unitarias - Custom Hook useCounter', () => {
  // Testing 1: Inicialización correcta del valor
  test('debe inicializarse con el valor por defecto y aceptar un valor personalizado', () => {
    const { result: resultDefault } = renderHook(() => useCounter());
    expect(resultDefault.current.count).toBe(0);

    const { result: resultCustom } = renderHook(() => useCounter(10));
    expect(resultCustom.current.count).toBe(10);
  });

  // Testing 2: Mutación del estado mediante increment y decrement usando act
  test('debe incrementar y decrementar el estado correctamente', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(6);

    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(5);
  });
}); 