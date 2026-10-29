import { useState, useEffect } from 'react';
import { obtenerProductos } from '../services/productos';
import { obtenerCategorias, categoriasDeProducto } from '../services/categorias';

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState({ 
    id: '', titulo: '', precioNumero: '', precioOriginal: '', imagen: '', stock: '', enOferta: false, categorias: [] 
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const [idOriginal, setIdOriginal] = useState(null);
  const [categoriasDisponibles] = useState(() => obtenerCategorias());

  useEffect(() => {
    setProductos(obtenerProductos()); // mismo stock que descuenta el carrito al comprar
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormulario({ ...formulario, [e.target.name]: value });
  };

  const toggleCategoria = (id) => {
    const actuales = formulario.categorias || [];
    const nuevas = actuales.includes(id) ? actuales.filter((c) => c !== id) : [...actuales, id];
    setFormulario({ ...formulario, categorias: nuevas });
  };

  const guardarProducto = (e) => {
    e.preventDefault();
    const idNumerico = Number(formulario.id);

    if (idNumerico !== idOriginal) {
      const existe = productos.some(p => p.id === idNumerico);
      if (existe) {
        alert(`Error: Ya existe un producto con el ID ${idNumerico}. Por favor, elige otro número.`);
        return; 
      }
    }
    
    if (Number(formulario.stock) <= 5) {
      alert(`Alerta: Estás guardando un producto con stock crítico (${formulario.stock} unidades disponibles).`);
    }

    let precioOrigFormateado = formulario.precioOriginal;
    if (precioOrigFormateado && !String(precioOrigFormateado).includes('$')) {
      precioOrigFormateado = `$${precioOrigFormateado}`;
    }

    const productoFinal = { 
      ...formulario, 
      id: idNumerico, 
      precioNumero: Number(formulario.precioNumero), 
      stock: Number(formulario.stock),
      precioOriginal: precioOrigFormateado
    };

    let nuevaLista;
    if (modoEdicion) {
      nuevaLista = productos.map(p => 
        p.id === idOriginal 
          ? { ...p, ...productoFinal } 
          : p
      );
    } else {
      nuevaLista = [...productos, productoFinal];
    }
    
    nuevaLista.sort((a, b) => a.id - b.id);

    setProductos(nuevaLista);
    localStorage.setItem('productos', JSON.stringify(nuevaLista));
    
    cancelar();
  };

  const editar = (prod) => {
    setFormulario({
      id: prod.id,
      titulo: prod.titulo,
      precioNumero: prod.precioNumero,
      precioOriginal: prod.precioOriginal ? String(prod.precioOriginal).replace(/\D/g, "") : '',
      imagen: prod.imagen,
      stock: prod.stock !== undefined ? prod.stock : 10,
      enOferta: prod.enOferta || false,
      categorias: categoriasDeProducto(prod)
    });
    setModoEdicion(true);
    setMostrarFormulario(true);
    setIdOriginal(prod.id); 
  };

  const eliminar = (id) => {
    const nuevaLista = productos.filter(p => p.id !== id);
    setProductos(nuevaLista);
    localStorage.setItem('productos', JSON.stringify(nuevaLista));
  };

  const cancelar = () => {
    setFormulario({ id: '', titulo: '', precioNumero: '', precioOriginal: '', imagen: '', stock: '', enOferta: false, categorias: [] });
    setModoEdicion(false);
    setMostrarFormulario(false);
    setIdOriginal(null); 
  };

  const toggleFormulario = () => {
    if (mostrarFormulario) {
      cancelar(); 
    } else {
      setMostrarFormulario(true);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestión de Productos</h2>
        <button 
          className={`btn ${mostrarFormulario ? 'btn-secondary' : 'btn-success'}`} 
          onClick={toggleFormulario}
        >
          {mostrarFormulario ? 'Cerrar Formulario' : 'Añadir Producto'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="card p-4 mb-4 shadow-sm border-success">
          <h4 className={modoEdicion ? "text-primary" : "text-success"}>
            {modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}
          </h4>
          <form onSubmit={guardarProducto} className="row g-3 align-items-end mt-2">
            
            <div className="col-md-1">
              <label className="form-label text-muted small fw-bold">ID</label>
              <input type="number" className="form-control" name="id" value={formulario.id} onChange={handleChange} required min="1" />
            </div>

            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold">TÍTULO DEL LENTE</label>
              <input type="text" className="form-control" name="titulo" value={formulario.titulo} onChange={handleChange} required />
            </div>
            
            <div className="col-md-2">
              <label className="form-label text-muted small fw-bold">PRECIO ($)</label>
              <input type="number" className="form-control" name="precioNumero" value={formulario.precioNumero} onChange={handleChange} required min="0" />
            </div>

            <div className="col-md-2">
              <label className="form-label text-muted small fw-bold">PRECIO ANTIGUO</label>
              <input type="number" className="form-control" name="precioOriginal" placeholder="Ej: 39990" value={formulario.precioOriginal} onChange={handleChange} min="0" />
            </div>

            <div className="col-md-1">
              <label className="form-label text-muted small fw-bold">STOCK</label>
              <input type="number" className="form-control" name="stock" value={formulario.stock} onChange={handleChange} required min="0" />
            </div>

            <div className="col-md-3 pb-2">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" name="enOferta" id="ofertaCheck" checked={formulario.enOferta} onChange={handleChange} />
                <label className="form-check-label text-danger fw-bold" htmlFor="ofertaCheck">
                  Activar Oferta (-%)
                </label>
              </div>
            </div>

            <div className="col-md-12">
              <label className="form-label text-muted small fw-bold d-block">CATEGORÍAS</label>
              {categoriasDisponibles.length === 0 && (
                <small className="text-muted">No hay categorías creadas. Créalas en Categorías.</small>
              )}
              {categoriasDisponibles.map((c) => (
                <div className="form-check form-check-inline" key={c.id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`cat-${c.id}`}
                    checked={(formulario.categorias || []).includes(c.id)}
                    onChange={() => toggleCategoria(c.id)}
                  />
                  <label className="form-check-label" htmlFor={`cat-${c.id}`}>{c.nombre}</label>
                </div>
              ))}
            </div>

            <div className="col-md-12">
              <label className="form-label text-muted small fw-bold">URL DE IMAGEN</label>
              <input type="text" className="form-control" name="imagen" placeholder="Ej: /img/lente1.jpg" value={formulario.imagen} onChange={handleChange} required />
            </div>
            
            <div className="col-12 mt-3 d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-secondary" onClick={cancelar}>
                Cancelar
              </button>
              <button type="submit" className={`btn ${modoEdicion ? 'btn-primary' : 'btn-success'}`}>
                {modoEdicion ? 'Guardar Cambios' : 'Agregar Producto'}
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
                <th>ID</th>
                <th>Imagen</th>
                <th>Título</th>
                <th>Precio Actual</th>
                <th>Estado</th>
                <th>Stock</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td className="align-middle fw-bold">{p.id}</td>
                  <td className="align-middle">
                    <img src={p.imagen} alt={p.titulo} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px' }} />
                  </td>
                  <td className="align-middle fw-bold">{p.titulo}</td>
                  <td className="align-middle">
                    <div className="d-flex flex-column">
                      <span className="text-success fw-bold">${Number(p.precioNumero).toLocaleString('es-CL')}</span>
                      {p.enOferta && p.precioOriginal && (
                        <small className="text-muted text-decoration-line-through">{p.precioOriginal}</small>
                      )}
                    </div>
                  </td>
                  <td className="align-middle">
                    {p.enOferta ? <span className="badge bg-danger">En Oferta</span> : <span className="badge bg-secondary">Normal</span>}
                  </td>
                  <td className="align-middle">
                    {Number(p.stock) <= 5 ? (
                      <span className="badge bg-danger">Crítico: {p.stock}</span>
                    ) : (
                      <span className="badge bg-success">{p.stock}</span>
                    )}
                  </td>
                  <td className="text-center align-middle">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editar(p)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(p.id)}>Eliminar</button>
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