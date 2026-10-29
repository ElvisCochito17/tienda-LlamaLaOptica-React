import { useState } from 'react';
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  contarProductos,
} from '../services/categorias';
import { productosLentes } from '../data/productos';

const leerProductos = () => {
  try {
    const guardados = JSON.parse(localStorage.getItem('productos'));
    return Array.isArray(guardados) && guardados.length > 0 ? guardados : productosLentes;
  } catch {
    return productosLentes;
  }
};

const FORMULARIO_VACIO = { nombre: '', descripcion: '' };

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState(() => obtenerCategorias());
  const [productos, setProductos] = useState(() => leerProductos());
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [idEditando, setIdEditando] = useState(null); // null = creando una nueva
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [error, setError] = useState('');

  const refrescar = () => {
    setCategorias(obtenerCategorias());
    setProductos(leerProductos());
  };

  const handleChange = (e) => setFormulario({ ...formulario, [e.target.name]: e.target.value });

  const cancelar = () => {
    setFormulario(FORMULARIO_VACIO);
    setIdEditando(null);
    setMostrarFormulario(false);
    setError('');
  };

  const guardar = (e) => {
    e.preventDefault();
    const resultado = idEditando ? actualizarCategoria(idEditando, formulario) : crearCategoria(formulario);

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    refrescar();
    cancelar();
  };

  const editar = (categoria) => {
    setFormulario({ nombre: categoria.nombre, descripcion: categoria.descripcion || '' });
    setIdEditando(categoria.id);
    setMostrarFormulario(true);
    setError('');
  };

  const eliminar = (categoria) => {
    const cantidad = contarProductos(productos, categoria.id);
    const aviso = cantidad > 0
      ? `"${categoria.nombre}" tiene ${cantidad} producto(s). Los productos NO se borran, solo dejarán de pertenecer a esta categoría. ¿Continuar?`
      : `¿Eliminar la categoría "${categoria.nombre}"?`;

    if (window.confirm(aviso)) {
      eliminarCategoria(categoria.id);
      refrescar();
    }
  };

  const toggleFormulario = () => (mostrarFormulario ? cancelar() : setMostrarFormulario(true));

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestión de Categorías</h2>
        <button className={`btn ${mostrarFormulario ? 'btn-secondary' : 'btn-success'}`} onClick={toggleFormulario}>
          {mostrarFormulario ? 'Cerrar Formulario' : 'Añadir Categoría'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="card p-4 mb-4 shadow-sm border-success">
          <h4 className={idEditando ? 'text-primary' : 'text-success'}>
            {idEditando ? 'Editar Categoría' : 'Nueva Categoría'}
          </h4>

          {error && (
            <div className="alert alert-danger py-2 mt-2" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={guardar} className="row g-3 align-items-end mt-1">
            <div className="col-md-4">
              <label className="form-label" htmlFor="cat-nombre">Nombre</label>
              <input
                id="cat-nombre"
                type="text"
                className="form-control"
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-8">
              <label className="form-label" htmlFor="cat-descripcion">Descripción (opcional)</label>
              <input
                id="cat-descripcion"
                type="text"
                className="form-control"
                name="descripcion"
                value={formulario.descripcion}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 d-flex gap-2">
              <button type="submit" className={`btn ${idEditando ? 'btn-primary' : 'btn-success'}`}>
                {idEditando ? 'Guardar Cambios' : 'Crear Categoría'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={cancelar}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th className="text-center">Productos</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No hay categorías. Crea la primera con "Añadir Categoría".
                    </td>
                  </tr>
                )}
                {categorias.map((c) => (
                  <tr key={c.id}>
                    <td className="align-middle fw-bold">{c.nombre}</td>
                    <td className="align-middle text-muted">{c.descripcion || '—'}</td>
                    <td className="align-middle text-center">
                      <span className="badge bg-primary">{contarProductos(productos, c.id)}</span>
                    </td>
                    <td className="text-center align-middle">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editar(c)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(c)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
