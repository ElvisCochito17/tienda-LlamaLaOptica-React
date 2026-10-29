import { describe, test, expect } from 'vitest';
import { crearOrden, obtenerOrdenes, actualizarEstado, ordenesDeUsuario } from '../ordenes';

describe('Servicio de órdenes', () => {
  test('crea órdenes con id correlativo, estado Pagado y las más nuevas primero', () => {
    const a = crearOrden({ usuarioEmail: 'a@correo.cl', total: 1000, productos: [] });
    const b = crearOrden({ usuarioEmail: 'b@correo.cl', total: 2000, productos: [] });

    expect(b.id).toBe(a.id + 1);
    expect(a.estado).toBe('Pagado');
    expect(obtenerOrdenes()[0].id).toBe(b.id);
  });

  test('actualiza el estado y filtra el historial por el correo del usuario', () => {
    const o = crearOrden({ usuarioEmail: 'ana@correo.cl', total: 1000, productos: [] });
    crearOrden({ usuarioEmail: 'otro@correo.cl', total: 500, productos: [] });

    actualizarEstado(o.id, 'Enviado');
    expect(obtenerOrdenes().find((x) => x.id === o.id).estado).toBe('Enviado');

    const historial = ordenesDeUsuario(obtenerOrdenes(), { email: 'ANA@correo.cl' }); // ignora mayúsculas
    expect(historial).toHaveLength(1);
    expect(historial[0].id).toBe(o.id);
  });
});
