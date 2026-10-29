import { describe, test, expect } from 'vitest';
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  categoriasDeProducto,
  productosPorCategoria,
  generarId,
} from '../categorias';

describe('CRUD de categorías', () => {
  test('crea una categoría nueva y la deja guardada; rechaza nombres repetidos o vacíos', () => {
    const resultado = crearCategoria({ nombre: 'Lentes Deportivos', descripcion: 'Para correr' });
    expect(resultado.ok).toBe(true);
    expect(resultado.categoria.id).toBe('lentes-deportivos');
    expect(obtenerCategorias().some((c) => c.id === 'lentes-deportivos')).toBe(true);

    expect(crearCategoria({ nombre: 'lentes deportivos' }).ok).toBe(false); // repetida
    expect(crearCategoria({ nombre: '   ' }).ok).toBe(false); // vacía
  });

  test('actualiza el nombre y al eliminar también la quita de los productos', () => {
    crearCategoria({ nombre: 'Infantil' });
    expect(actualizarCategoria('infantil', { nombre: 'Lentes Infantiles' }).ok).toBe(true);
    expect(obtenerCategorias().find((c) => c.id === 'infantil').nombre).toBe('Lentes Infantiles');

    localStorage.setItem('productos', JSON.stringify([{ id: 1, titulo: 'X', categorias: ['infantil', 'sol'] }]));
    eliminarCategoria('infantil');

    expect(obtenerCategorias().some((c) => c.id === 'infantil')).toBe(false);
    expect(JSON.parse(localStorage.getItem('productos'))[0].categorias).toEqual(['sol']);
  });
});

describe('Asignación de productos a categorías', () => {
  test('deduce la categoría desde el título cuando el producto no tiene el campo categorias', () => {
    expect(categoriasDeProducto({ titulo: 'Lentes de mujer de sol' })).toEqual(['mujer', 'sol']);
    expect(categoriasDeProducto({ titulo: 'Lentes de hombre sencillos' })).toEqual(['hombre', 'opticos']);
    expect(categoriasDeProducto({ titulo: 'Cualquiera', categorias: ['sol'] })).toEqual(['sol']);
  });

  test('filtra productos por categoría y "todos" devuelve la lista completa', () => {
    const productos = [
      { id: 1, titulo: 'A', categorias: ['sol'] },
      { id: 2, titulo: 'B', categorias: ['opticos'] },
    ];
    expect(productosPorCategoria(productos, 'sol')).toHaveLength(1);
    expect(productosPorCategoria(productos, 'todos')).toHaveLength(2);
    expect(generarId('Ñandú Óptico')).toBe('nandu-optico');
  });
});
