// CRUD de categorías guardado en localStorage (misma idea que services/ordenes.js).
// Un producto puede tener VARIAS categorías: producto.categorias = ['mujer', 'sol'].
// Si un producto viejo no tiene ese campo, se deduce desde su título (ver categoriasDeProducto).
const CLAVE = 'categorias';

export const CATEGORIAS_INICIALES = [
  { id: 'mujer', nombre: 'Lentes de Mujer', descripcion: 'Diseños pensados para ella.', palabraClave: 'mujer' },
  { id: 'hombre', nombre: 'Lentes de Hombre', descripcion: 'Diseños pensados para él.', palabraClave: 'hombre' },
  { id: 'sol', nombre: 'Lentes de Sol', descripcion: 'Protección UV para el día a día.', palabraClave: 'sol' },
  { id: 'opticos', nombre: 'Lentes Ópticos', descripcion: 'Monturas para uso diario con receta.', palabraClave: '' },
];

const leer = () => {
  try {
    const valor = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(valor) ? valor : null;
  } catch {
    return null;
  }
};

const guardar = (lista) => localStorage.setItem(CLAVE, JSON.stringify(lista));

// READ: si aún no hay categorías guardadas, se siembran las iniciales.
export const obtenerCategorias = () => {
  const guardadas = leer();
  if (guardadas) return guardadas;
  guardar(CATEGORIAS_INICIALES);
  return [...CATEGORIAS_INICIALES];
};

// Convierte "Lentes Deportivos" en "lentes-deportivos" para usarlo como id.
export const generarId = (nombre) =>
  String(nombre)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// CREATE: devuelve { ok, categoria } o { ok: false, error }
export const crearCategoria = ({ nombre, descripcion = '' }) => {
  const limpio = String(nombre || '').trim();
  if (!limpio) return { ok: false, error: 'El nombre es obligatorio.' };

  const lista = obtenerCategorias();
  const id = generarId(limpio);
  if (lista.some((c) => c.id === id)) {
    return { ok: false, error: `Ya existe una categoría llamada "${limpio}".` };
  }

  const categoria = { id, nombre: limpio, descripcion: String(descripcion).trim(), palabraClave: '' };
  guardar([...lista, categoria]);
  return { ok: true, categoria };
};

// UPDATE: el id no cambia (los productos lo usan para referenciar la categoría).
export const actualizarCategoria = (id, { nombre, descripcion = '' }) => {
  const limpio = String(nombre || '').trim();
  if (!limpio) return { ok: false, error: 'El nombre es obligatorio.' };

  const lista = obtenerCategorias();
  if (!lista.some((c) => c.id === id)) return { ok: false, error: 'La categoría no existe.' };

  const repetida = lista.some((c) => c.id !== id && c.nombre.toLowerCase() === limpio.toLowerCase());
  if (repetida) return { ok: false, error: `Ya existe una categoría llamada "${limpio}".` };

  guardar(lista.map((c) => (c.id === id ? { ...c, nombre: limpio, descripcion: String(descripcion).trim() } : c)));
  return { ok: true };
};

// DELETE: además quita la categoría de los productos que la tenían asignada.
export const eliminarCategoria = (id) => {
  guardar(obtenerCategorias().filter((c) => c.id !== id));

  try {
    const productos = JSON.parse(localStorage.getItem('productos'));
    if (Array.isArray(productos)) {
      const actualizados = productos.map((p) =>
        Array.isArray(p.categorias) ? { ...p, categorias: p.categorias.filter((c) => c !== id) } : p
      );
      localStorage.setItem('productos', JSON.stringify(actualizados));
    }
  } catch {
    /* si los productos están corruptos no hay nada que limpiar */
  }
};

// Categorías de un producto. Si trae el campo "categorias" se usa tal cual;
// si no (datos antiguos), se deduce del título como lo hacía el catálogo original.
export const categoriasDeProducto = (producto) => {
  if (Array.isArray(producto.categorias)) return producto.categorias;

  const titulo = String(producto.titulo || '').toLowerCase();
  const ids = [];
  if (titulo.includes('mujer')) ids.push('mujer');
  if (titulo.includes('hombre')) ids.push('hombre');
  if (titulo.includes('sol')) ids.push('sol');
  else ids.push('opticos');
  return ids;
};

export const productosPorCategoria = (productos, idCategoria) =>
  idCategoria === 'todos' ? productos : productos.filter((p) => categoriasDeProducto(p).includes(idCategoria));

export const contarProductos = (productos, idCategoria) => productosPorCategoria(productos, idCategoria).length;
