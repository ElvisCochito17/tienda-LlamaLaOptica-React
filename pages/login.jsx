import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  // Estados para guardar lo que el usuario escribe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 1. Obtener los usuarios guardados desde el LocalStorage
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];

    // 2. Buscar si existe un usuario que coincida exactamente con email y contraseña
    const usuarioEncontrado = usuariosGuardados.find(
      (user) => user.email === email && user.password === password
    );

    if (usuarioEncontrado) {
      // Opcional: Guardar en memoria quién está activo por si lo necesitas para el carrito
      localStorage.setItem('usuarioActivo', JSON.stringify(usuarioEncontrado));
      
      setError('');
      
      // 3. Redirigir dependiendo del rol
      if (usuarioEncontrado.rol === 'Administrador') {
        navigate('/admin/usuarios'); // Lo mandamos directo a su panel
      } else {
        navigate('/'); // Si es cliente, lo mandamos al home o catálogo
      }
    } else {
      // Si no hay coincidencia, tiramos el error
      setError('Correo o contraseña incorrectos. Intenta de nuevo.');
    }
  };

  return (
    <section className="container my-5 d-flex justify-content-center">
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        
        {/* Mensaje de error si se equivoca */}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              className="form-control" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          {/* Contenido principal */}
          <button type="submit" className="btn btn-dark w-100 mt-3">
            Ingresar
          </button>
        </form>
      </div>
    </section>
  );
}