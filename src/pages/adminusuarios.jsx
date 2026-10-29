import { useState, useEffect } from 'react';
import HistorialCompras from '../componentes/HistorialCompras';
import { obtenerOrdenes, ordenesDeUsuario } from '../services/ordenes';

// Correos de los usuarios de ejemplo que antes se creaban solos
const USUARIOS_DE_EJEMPLO = ['gabriel@correo.cl', 'cliente@correo.cl'];

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  // Cambiamos 'correo' por 'email' para que coincida con tu registro
  const [formulario, setFormulario] = useState({ id: '', nombre: '', email: '', rol: 'Cliente' });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const [idOriginal, setIdOriginal] = useState(null);
  const [usuarioHistorial, setUsuarioHistorial] = useState(null); // usuario cuyo historial se está viendo

  useEffect(() => {
    // Solo se muestran los usuarios reales (los que se registran o crea el administrador).
    // Antes se creaban 2 usuarios de ejemplo automáticamente; si quedaron guardados, se quitan una sola vez.
    const guardados = JSON.parse(localStorage.getItem('usuarios')) || [];
    const reales = guardados.filter(
      (u) => !(USUARIOS_DE_EJEMPLO.includes(u.email) && !u.password)
    );
    if (reales.length !== guardados.length) {
      localStorage.setItem('usuarios', JSON.stringify(reales));
    }
    setUsuarios(reales);
  }, []);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const guardarUsuario = (e) => {
    e.preventDefault();
    const idNumerico = Number(formulario.id);

    if (idNumerico !== idOriginal) {
      const existe = usuarios.some(u => u.id === idNumerico);
      if (existe) {
        alert(`❌ Error: Ya existe un usuario con el ID ${idNumerico}.`);
        return; 
      }
    }

    let nuevaLista;
    if (modoEdicion) {
      nuevaLista = usuarios.map(u => 
        u.id === idOriginal 
          ? { ...formulario, id: idNumerico } 
          : u
      );
    } else {
      nuevaLista = [...usuarios, { ...formulario, id: idNumerico }];
    }
    
    nuevaLista.sort((a, b) => a.id - b.id);

    setUsuarios(nuevaLista);
    localStorage.setItem('usuarios', JSON.stringify(nuevaLista));
    
    // Limpiamos con 'email'
    setFormulario({ id: '', nombre: '', email: '', rol: 'Cliente' });
    setModoEdicion(false);
    setMostrarFormulario(false);
    setIdOriginal(null);
  };

  const editar = (user) => {
    setFormulario(user);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setIdOriginal(user.id);
  };

  const eliminar = (id) => {
    if(window.confirm('¿Estás seguro de eliminar este usuario?')) {
      const nuevaLista = usuarios.filter(u => u.id !== id);
      setUsuarios(nuevaLista);
      localStorage.setItem('usuarios', JSON.stringify(nuevaLista));
    }
  };

  const verHistorial = (usuario) => setUsuarioHistorial(usuario);

  const cancelar = () => {
    // Limpiamos con 'email'
    setFormulario({ id: '', nombre: '', email: '', rol: 'Cliente' });
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
        <h2 className="mb-0">Gestión de Usuarios</h2>
        <button 
          className={`btn ${mostrarFormulario ? 'btn-secondary' : 'btn-success'}`} 
          onClick={toggleFormulario}
        >
          {mostrarFormulario ? 'Cerrar Formulario' : 'Añadir Usuario'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="card p-4 mb-4 shadow-sm border-success">
          <h4 className={modoEdicion ? "text-primary" : "text-success"}>
            {modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h4>
          <form onSubmit={guardarUsuario} className="row g-3 align-items-end mt-2">
            
            <div className="col-md-2">
              <label className="form-label">ID Usuario</label>
              <input type="number" className="form-control" name="id" value={formulario.id} onChange={handleChange} required min="1" />
            </div>

            <div className="col-md-4">
              <label className="form-label">Nombre Completo</label>
              <input type="text" className="form-control" name="nombre" value={formulario.nombre} onChange={handleChange} required />
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Correo Electrónico</label>
              {/* Cambiamos el name a 'email' y leemos de formulario.email */}
              <input type="email" className="form-control" name="email" value={formulario.email} onChange={handleChange} required />
            </div>

            <div className="col-md-2">
              <label className="form-label">Rol</label>
              <select className="form-select" name="rol" value={formulario.rol} onChange={handleChange} required>
                <option value="Cliente">Cliente</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
            
            <div className="col-12 mt-3 d-flex gap-2">
              <button type="submit" className={`btn ${modoEdicion ? 'btn-primary' : 'btn-success'}`}>
                {modoEdicion ? 'Guardar Cambios' : 'Registrar Usuario'}
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
          <div className="table-responsive">
<table className="table table-hover table-striped mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">Aún no hay usuarios registrados.</td>
                </tr>
              )}
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td className="align-middle fw-bold">{u.id}</td>
                  <td className="align-middle fw-bold">{u.nombre}</td>
                  {/* Buscamos u.email. Si tienes alguno viejo con correo, mostramos u.correo por si acaso */}
                  <td className="align-middle">{u.email || u.correo}</td>
                  <td className="align-middle">
                    <span className={`badge ${u.rol === 'Administrador' ? 'bg-danger' : 'bg-primary'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="text-center align-middle">
                    <button className="btn btn-sm btn-outline-info me-2" onClick={() => verHistorial(u)}>Historial</button>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editar(u)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(u.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {usuarioHistorial && (
        <HistorialCompras
          usuario={usuarioHistorial}
          ordenes={ordenesDeUsuario(obtenerOrdenes(), usuarioHistorial)}
          onCerrar={() => setUsuarioHistorial(null)}
        />
      )}
    </div>
  );
}
