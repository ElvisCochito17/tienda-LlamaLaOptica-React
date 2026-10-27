import { useState, useEffect } from 'react';

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState({ id: '', titulo: '', precio: '', imagen: '', stock: '' });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // NUEVO: Guardamos el ID original como ancla secreta para no perder el producto si le cambias el ID
  const [idOriginal, setIdOriginal] = useState(null);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('productos_admin'));
    if (guardados && guardados.length > 0) {
      const conStock = guardados.map(p => ({...p, stock: p.stock !== undefined ? p.stock : 10}));
      setProductos(conStock);
    } else {
      const iniciales = [
        { id: 1, titulo: "Lentes Clásicos", precio: 29990, imagen: "https://via.placeholder.com/50", stock: 15 },
        { id: 2, titulo: "Lentes de Sol Aviador", precio: 39990, imagen: "https://via.placeholder.com/50", stock: 4 }
      ];
      setProductos(iniciales);
      localStorage.setItem('productos_admin', JSON.stringify(iniciales));
    }
  }, []);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const guardarProducto = (e) => {
    e.preventDefault();
    const idNumerico = Number(formulario.id);

    // Verificamos que el nuevo ID no exista (EXCEPTO si es el mismo producto que estamos editando)
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

    let nuevaLista;
    if (modoEdicion) {
      nuevaLista = productos.map(p => 
        // Usamos el idOriginal para encontrar a quién reemplazar
        p.id === idOriginal 
          ? { ...formulario, id: idNumerico, precio: Number(formulario.precio), stock: Number(formulario.stock) } 
          : p
      );
    } else {
      nuevaLista = [...productos, { ...formulario, id: idNumerico, precio: Number(formulario.precio), stock: Number(formulario.stock) }];
    }
    
    // Siempre ordenamos la lista sin importar si creamos o editamos
    nuevaLista.sort((a, b) => a.id - b.id);

    setProductos(nuevaLista);
    localStorage.setItem('productos_admin', JSON.stringify(nuevaLista));
    
    setFormulario({ id: '', titulo: '', precio: '', imagen: '', stock: '' });
    setModoEdicion(false);
    setMostrarFormulario(false);
    setIdOriginal(null); // Limpiamos el ancla
  };

  const editar = (prod) => {
    setFormulario(prod);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setIdOriginal(prod.id); // Guardamos el ancla original al abrir el modo edición
  };

  const eliminar = (id) => {
    const nuevaLista = productos.filter(p => p.id !== id);
    setProductos(nuevaLista);
    localStorage.setItem('productos_admin', JSON.stringify(nuevaLista));
  };

  const cancelar = () => {
    setFormulario({ id: '', titulo: '', precio: '', imagen: '', stock: '' });
    setModoEdicion(false);
    setMostrarFormulario(false);
    setIdOriginal(null); // Limpiamos el ancla
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
            
            <div className="col-md-2">
              <label className="form-label">ID Producto</label>
              {/* Le quitamos el disabled para darte el Modo Dios */}
              <input type="number" className="form-control" name="id" value={formulario.id} onChange={handleChange} required min="1" />
            </div>

            <div className="col-md-3">
              <label className="form-label">Título del Lente</label>
              <input type="text" className="form-control" name="titulo" value={formulario.titulo} onChange={handleChange} required />
            </div>
            <div className="col-md-2">
              <label className="form-label">Precio ($)</label>
              <input type="number" className="form-control" name="precio" value={formulario.precio} onChange={handleChange} required min="0" />
            </div>
            <div className="col-md-2">
              <label className="form-label">Stock</label>
              <input type="number" className="form-control" name="stock" value={formulario.stock} onChange={handleChange} required min="0" />
            </div>
            <div className="col-md-3">
              <label className="form-label">URL de Imagen</label>
              <input type="text" className="form-control" name="imagen" placeholder="Ej: https://.../imagen.jpg" value={formulario.imagen} onChange={handleChange} required />
            </div>
            
            <div className="col-12 mt-3 d-flex gap-2">
              <button type="submit" className={`btn ${modoEdicion ? 'btn-primary' : 'btn-success'}`}>
                {modoEdicion ? 'Guardar Cambios' : 'Agregar Producto'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={cancelar}>
                Cancelar / Limpiar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Título</th>
                <th>Precio</th>
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
                  <td className="align-middle">${Number(p.precio).toLocaleString('es-CL')}</td>
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
  );
}