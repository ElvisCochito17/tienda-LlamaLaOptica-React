// Única fuente de verdad para los pedidos: tanto "Mis pedidos" (cliente)
// como "Órdenes" (administrador) leen y escriben aquí.
const CLAVE = 'ordenes';
const CLAVES_ANTIGUAS = ['ordenes_admin', 'mis_ordenes'];

export const ESTADOS = ['Pagado', 'Enviado', 'Entregado'];

const leer = (clave) => {
  try {
    const valor = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(valor) ? valor : [];
  } catch {
    return [];
  }
};

// Une las listas antiguas (una vez) y descarta la orden falsa que se sembraba en el admin.
const migrarDatosAntiguos = () => {
  if (localStorage.getItem(CLAVE) !== null) return;

  const porId = new Map();
  [...leer('mis_ordenes'), ...leer('ordenes_admin')].forEach((o) => {
    const esDemo = o.id === 9858 && o.cliente === 'vicente';
    if (!esDemo) porId.set(String(o.id), o); // ordenes_admin gana si hay duplicado
  });

  localStorage.setItem(CLAVE, JSON.stringify([...porId.values()]));
  CLAVES_ANTIGUAS.forEach((k) => localStorage.removeItem(k));
};

const guardar = (lista) => {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
};

export const obtenerOrdenes = () => {
  migrarDatosAntiguos();
  return leer(CLAVE);
};

export const crearOrden = (datos) => {
  const lista = obtenerOrdenes();
  const maxId = lista.reduce((max, o) => Math.max(max, Number(o.id) || 0), 1000);
  const orden = {
    ...datos,
    id: maxId + 1, // correlativo, sin colisiones
    fecha: new Date().toLocaleDateString('es-CL'),
    fechaISO: new Date().toISOString(),
    estado: 'Pagado',
  };
  guardar([orden, ...lista]); // las más nuevas primero
  return orden;
};

export const actualizarEstado = (id, estado) => {
  const lista = obtenerOrdenes().map((o) =>
    String(o.id) === String(id) ? { ...o, estado } : o
  );
  guardar(lista);
  return lista;
};

export const obtenerUsuarioActivo = () => {
  try {
    return JSON.parse(localStorage.getItem('usuarioActivo'));
  } catch {
    return null;
  }
};

const mismoCorreo = (a, b) =>
  !!a && !!b && String(a).trim().toLowerCase() === String(b).trim().toLowerCase();

export const pertenecePedido = (orden, usuario) =>
  !!usuario &&
  (mismoCorreo(orden.usuarioEmail, usuario.email) || mismoCorreo(orden.email, usuario.email));

// Historial de compras de un usuario (lo usa el panel de administración).
export const ordenesDeUsuario = (ordenes, usuario) =>
  ordenes.filter((o) => pertenecePedido(o, usuario));
