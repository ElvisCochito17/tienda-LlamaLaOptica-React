// Cálculos para el módulo de reportes del administrador.
// Son funciones puras (reciben datos y devuelven un resultado), por eso son fáciles de probar.
import { ESTADOS } from './ordenes';

export const resumenVentas = (ordenes) => {
  const totalOrdenes = ordenes.length;
  const ingresos = ordenes.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const unidades = ordenes.reduce(
    (acc, o) => acc + (o.productos || []).reduce((sub, p) => sub + (Number(p.cantidad) || 0), 0),
    0
  );
  const ticketPromedio = totalOrdenes > 0 ? Math.round(ingresos / totalOrdenes) : 0;

  return { totalOrdenes, ingresos, unidades, ticketPromedio };
};

export const productosMasVendidos = (ordenes, limite = 5) => {
  const acumulado = {};

  ordenes.forEach((o) => {
    (o.productos || []).forEach((p) => {
      if (!acumulado[p.titulo]) acumulado[p.titulo] = { titulo: p.titulo, unidades: 0, ingresos: 0 };
      acumulado[p.titulo].unidades += Number(p.cantidad) || 0;
      acumulado[p.titulo].ingresos += (Number(p.precio) || 0) * (Number(p.cantidad) || 0);
    });
  });

  return Object.values(acumulado)
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, limite);
};

export const ventasPorMetodoPago = (ordenes) => {
  const acumulado = {};

  ordenes.forEach((o) => {
    const metodo = o.metodoPago || 'Sin especificar';
    if (!acumulado[metodo]) acumulado[metodo] = { metodo, ordenes: 0, ingresos: 0 };
    acumulado[metodo].ordenes += 1;
    acumulado[metodo].ingresos += Number(o.total) || 0;
  });

  return Object.values(acumulado).sort((a, b) => b.ingresos - a.ingresos);
};

export const ordenesPorEstado = (ordenes) =>
  ESTADOS.map((estado) => ({
    estado,
    cantidad: ordenes.filter((o) => o.estado === estado).length,
  }));

// Productos con stock igual o menor al umbral (mismo criterio que usa el panel de productos: 5)
export const productosCriticos = (productos, umbral = 5) =>
  productos
    .filter((p) => Number(p.stock) <= umbral)
    .sort((a, b) => Number(a.stock) - Number(b.stock));

export const usuariosPorRol = (usuarios) => {
  const acumulado = {};
  usuarios.forEach((u) => {
    const rol = u.rol || 'Cliente';
    acumulado[rol] = (acumulado[rol] || 0) + 1;
  });
  return Object.entries(acumulado).map(([rol, cantidad]) => ({ rol, cantidad }));
};
