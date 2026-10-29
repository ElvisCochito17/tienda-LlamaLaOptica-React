import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

// Cada prueba parte con localStorage vacío para que no se contaminen entre sí.
beforeEach(() => {
  localStorage.clear();
});
