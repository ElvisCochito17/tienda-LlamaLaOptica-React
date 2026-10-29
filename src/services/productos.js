// Fuente de datos de los productos y de su STOCK.
// El catálogo, el carrito y el panel de administración leen y escriben aquí,
// por eso cuando alguien compra, el administrador ve el stock actualizado.
import { productosLentes } from '../data/productos';

const CLAVE = 'productos';
export const STOCK_INICIAL = 10;

const leer = () => {
  try {
    const valor = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(valor) && valor.length > 0 ? valor : null;
  } catch {
    return null;
  }
};

export const guardarProductos = (lista) => {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
};

// READ: si todavía no hay productos guardados se cargan los del catálogo con stock inicial.
// Los productos guardados que no tengan stock (datos antiguos) reciben el stock inicial.
export const obtenerProductos = () => {
  const guardados = leer();

  if (guardados === null) {
    const iniciales = productosLentes.map((p) => ({ ...p, stock: STOCK_INICIAL }));
    guardarProductos(iniciales);
    return iniciales;
  }

  const conStock = guardados.map((p) => (p.stock !== undefined ? p : { ...p, stock: STOCK_INICIAL }));
  if (conStock.some((p, i) => p !== guardados[i])) guardarProductos(conStock);
  return conStock;
};

// Unidades de un producto que ya están en el carrito (todavía no compradas)
export const cantidadEnCarrito = (idProducto) => {
  try {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    return carrito.filter((i) => i.id === idProducto).reduce((acc, i) => acc + i.cantidad, 0);
  } catch {
    return 0;
  }
};

// ¿Se puede agregar una unidad más al carrito sin pasarse del stock?
export const puedeAgregar = (producto) =>
  (Number(producto.stock) || 0) - cantidadEnCarrito(producto.id) > 0;

// Revisa que el stock alcance para todo lo que hay en el carrito.
// Devuelve la lista de productos con problema ([] = todo bien).
export const validarStock = (items, productos = obtenerProductos()) =>
  items.reduce((problemas, item) => {
    const producto = productos.find((p) => p.id === item.id);
    const disponible = producto ? Math.max(0, Number(producto.stock) || 0) : 0; // si el admin lo eliminó, no hay stock
    if (item.cantidad > disponible) {
      problemas.push({ id: item.id, titulo: item.titulo, pedido: item.cantidad, disponible });
    }
    return problemas;
  }, []);

// UPDATE: descuenta lo comprado (nunca baja de 0) y devuelve la lista actualizada
export const descontarStock = (items) => {
  const actualizados = obtenerProductos().map((p) => {
    const comprados = items.filter((i) => i.id === p.id).reduce((acc, i) => acc + i.cantidad, 0);
    return comprados > 0 ? { ...p, stock: Math.max(0, (Number(p.stock) || 0) - comprados) } : p;
  });
  guardarProductos(actualizados);
  return actualizados;
};
