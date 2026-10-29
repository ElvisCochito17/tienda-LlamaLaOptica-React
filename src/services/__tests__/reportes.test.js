import { describe, test, expect } from 'vitest';
import { resumenVentas, productosMasVendidos, productosCriticos } from '../reportes';

const ordenes = [
  { total: 30000, productos: [{ titulo: 'A', precio: 10000, cantidad: 3 }] },
  { total: 20000, productos: [{ titulo: 'B', precio: 10000, cantidad: 1 }, { titulo: 'A', precio: 10000, cantidad: 1 }] },
];

describe('Servicio de reportes', () => {
  test('resume ingresos, unidades y ticket promedio', () => {
    expect(resumenVentas(ordenes)).toEqual({ totalOrdenes: 2, ingresos: 50000, unidades: 5, ticketPromedio: 25000 });
    expect(resumenVentas([]).ticketPromedio).toBe(0); // sin órdenes no divide por cero
  });

  test('ordena los productos más vendidos y detecta stock crítico', () => {
    const ranking = productosMasVendidos(ordenes);
    expect(ranking[0]).toMatchObject({ titulo: 'A', unidades: 4 });

    const criticos = productosCriticos([{ titulo: 'X', stock: 2 }, { titulo: 'Y', stock: 50 }, { titulo: 'Z', stock: 5 }]);
    expect(criticos.map((p) => p.titulo)).toEqual(['X', 'Z']);
  });
});
