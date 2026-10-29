import { describe, test, expect } from 'vitest';
import {
  obtenerProductos,
  descontarStock,
  validarStock,
  puedeAgregar,
  STOCK_INICIAL,
} from '../productos';

describe('Servicio de productos y stock', () => {
  test('carga el catálogo con stock inicial la primera vez y lo deja guardado', () => {
    const productos = obtenerProductos();

    expect(productos.length).toBeGreaterThan(0);
    expect(productos.every((p) => p.stock === STOCK_INICIAL)).toBe(true);
    expect(JSON.parse(localStorage.getItem('productos'))).toHaveLength(productos.length);
  });

  test('descuenta el stock de lo comprado y nunca baja de 0', () => {
    const idProducto = obtenerProductos()[0].id;

    descontarStock([{ id: idProducto, titulo: 'X', cantidad: 3 }]);
    expect(obtenerProductos().find((p) => p.id === idProducto).stock).toBe(STOCK_INICIAL - 3);

    descontarStock([{ id: idProducto, titulo: 'X', cantidad: 999 }]);
    expect(obtenerProductos().find((p) => p.id === idProducto).stock).toBe(0);
  });

  test('validarStock detecta cuando no alcanza el stock o el producto ya no existe', () => {
    const idProducto = obtenerProductos()[0].id;

    const ok = validarStock([{ id: idProducto, titulo: 'A', cantidad: STOCK_INICIAL }]);
    expect(ok).toEqual([]);

    const faltan = validarStock([
      { id: idProducto, titulo: 'A', cantidad: STOCK_INICIAL + 1 },
      { id: 12345, titulo: 'Eliminado', cantidad: 1 },
    ]);
    expect(faltan).toHaveLength(2);
    expect(faltan[0].disponible).toBe(STOCK_INICIAL);
    expect(faltan[1].disponible).toBe(0);
  });

  test('puedeAgregar tiene en cuenta lo que ya está en el carrito', () => {
    const producto = { id: 7, stock: 2 };
    expect(puedeAgregar(producto)).toBe(true);

    localStorage.setItem('carrito', JSON.stringify([{ id: 7, titulo: 'Y', precio: 1, cantidad: 2 }]));
    expect(puedeAgregar(producto)).toBe(false);
    expect(puedeAgregar({ id: 8, stock: 0 })).toBe(false);
  });
});
