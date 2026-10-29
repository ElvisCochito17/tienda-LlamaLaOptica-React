import React, { useEffect, useState } from 'react';

export default function AdminPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '', edad: '' });

  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (usuarioActivo) {
      setUsuario(usuarioActivo);
      setFormData({
        nombre: usuarioActivo.nombre || 'Administrador Maestro',
        email: usuarioActivo.email || 'admin@llamalaoptica.cl',
        edad: usuarioActivo.edad || '30'
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const guardarCambios = (e) => {
    e.preventDefault();
    const usuarioActualizado = { ...usuario, ...formData, rol: 'Administrador' };
    
    // Al guardar, actualizamos la sesión activa del administrador
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActualizado));
    setUsuario(usuarioActualizado);
    setModoEdicion(false);
    
    alert("Configuración de cuenta administrativa actualizada con éxito.");
  };

  const toggleEdicion = (e) => {
    e.preventDefault();
    if (modoEdicion) {
      // Si cancela, restauramos los datos originales
      setFormData({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        edad: usuario.edad || ''
      });
    }
    setModoEdicion(!modoEdicion);
  };

  if (!usuario) {
    return <div className="container mt-4 fw-bold">Cargando credenciales administrativas...</div>;
  }

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4 fw-bold" style={{ color: '#2c3e50' }}>Configuración de Cuenta</h2>
      
      <div className="row align-items-start">
        {/* COLUMNA IZQUIERDA: Tarjeta Ejecutiva */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
            <div className="card-body text-center p-4">
              <div 
                className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
                style={{ width: '120px', height: '120px', fontSize: '4rem', fontWeight: 'bold' }}
              >
                {formData.nombre ? formData.nombre.charAt(0).toUpperCase() : 'A'}
              </div>
              <h4 className="fw-bold mb-1">{usuario.nombre || 'Administrador Maestro'}</h4>
              <p className="text-muted mb-3">Super Administrador</p>
              
              <span className="badge bg-success px-3 py-2 rounded-pill mb-4" style={{ fontSize: '0.9rem' }}>
                Estado: Activo
              </span>
              
              <ul className="list-group list-group-flush text-start">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="fw-bold text-muted">Nivel de Acceso</span>
                  <span className="badge bg-dark">Total</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="fw-bold text-muted">Última Conexión</span>
                  <span className="text-dark">En línea</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Formulario Detallado */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
            
            {/* Cabecera de la tarjeta con el botón integrado */}
            <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
              <h5 className="mb-0 fw-bold">Detalles del Perfil</h5>
              <button 
                className={`btn btn-sm px-3 fw-bold shadow-sm ${modoEdicion ? 'btn-danger' : 'btn-dark'}`}
                onClick={toggleEdicion}
              >
                {modoEdicion ? 'Cancelar Edición' : 'Modificar Datos'}
              </button>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={guardarCambios}>
                <div className="row g-4">
                  
                  <div className="col-md-12">
                    <label className="form-label fw-bold text-muted small text-uppercase mb-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg bg-light" 
                      name="nombre"
                      value={formData.nombre} 
                      onChange={handleChange}
                      disabled={!modoEdicion}
                      style={{ border: '1px solid #dee2e6' }}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold text-muted small text-uppercase mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      className="form-control form-control-lg bg-light" 
                      name="email"
                      value={formData.email} 
                      onChange={handleChange}
                      disabled={!modoEdicion}
                      style={{ border: '1px solid #dee2e6' }}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold text-muted small text-uppercase mb-1">Edad</label>
                    <input 
                      type="number" 
                      className="form-control form-control-lg bg-light" 
                      name="edad"
                      value={formData.edad} 
                      onChange={handleChange}
                      disabled={!modoEdicion}
                      style={{ border: '1px solid #dee2e6' }}
                      required
                      min="18"
                    />
                  </div>

                </div>

                {modoEdicion && (
                  <div className="mt-4 pt-4 border-top text-end">
                    <button type="submit" className="btn btn-success btn-lg px-5 fw-bold shadow">
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}