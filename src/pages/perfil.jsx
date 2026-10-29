import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '', edad: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    
    if (usuarioActivo) {
      setUsuario(usuarioActivo);
      setFormData({
        nombre: usuarioActivo.nombre || '',
        email: usuarioActivo.email || '',
        edad: usuarioActivo.edad || ''
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const guardarCambios = (e) => {
    e.preventDefault();
    
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    const nuevaLista = usuariosGuardados.map(u => 
      u.email === usuario.email 
        ? { ...u, nombre: formData.nombre, email: formData.email, edad: formData.edad } 
        : u
    );
    
    localStorage.setItem('usuarios', JSON.stringify(nuevaLista));

    const usuarioActualizado = { ...usuario, ...formData };
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActualizado));
    
    setUsuario(usuarioActualizado);
    setModoEdicion(false);
    alert("¡Datos actualizados con éxito!");
  };

  const cancelarEdicion = () => {
    setFormData({
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      edad: usuario.edad || ''
    });
    setModoEdicion(false);
  };

  if (!usuario) {
    return null; 
  }

  return (
    <section className="container my-5 d-flex flex-column align-items-center">
      
      <div style={{ width: '500px' }} className="mb-3">
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: 'none', border: 'none', color: '#000', 
            fontWeight: 'bold', padding: 0, cursor: 'pointer', textDecoration: 'underline'
          }}
        >
          &lt; Volver atrás
        </button>
      </div>

      <div className="card shadow p-4" style={{ width: '500px', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <div 
            className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: '100px', height: '100px', fontSize: '3rem', fontWeight: 'bold' }}
          >
            {formData.nombre ? formData.nombre.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2>Mi Perfil</h2>
          <p className="text-muted">Información de tu cuenta</p>
        </div>

        <form onSubmit={guardarCambios}>
          <div className="mb-3">
            <label className="form-label fw-bold">Nombre Completo</label>
            <input 
              type="text" 
              className="form-control" 
              name="nombre"
              value={formData.nombre} 
              onChange={handleChange}
              disabled={!modoEdicion}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Correo Electrónico</label>
            <input 
              type="email" 
              className="form-control" 
              name="email"
              value={formData.email} 
              onChange={handleChange}
              disabled={!modoEdicion}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Edad</label>
            <input 
              type="number" 
              className="form-control" 
              name="edad"
              value={formData.edad} 
              onChange={handleChange}
              disabled={!modoEdicion}
              required
              min="14"
            />
          </div>

          <div className="d-flex flex-column gap-2 mt-4">
            {modoEdicion ? (
              <>
                <button type="submit" className="btn btn-success w-100">
                  Guardar Cambios
                </button>
                <button type="button" className="btn btn-outline-secondary w-100" onClick={cancelarEdicion}>
                  Cancelar
                </button>
              </>
            ) : (
              <button 
                type="button" 
                className="btn btn-dark w-100" 
                onClick={(e) => {
                  e.preventDefault(); // Forzamos a que no se envíe el formulario
                  setModoEdicion(true);
                }}
              >
                Editar Perfil
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}