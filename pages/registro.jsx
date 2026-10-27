import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/registro.css'; 

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [edad, setEdad] = useState('');
  
  const navigate = useNavigate();

  const handleRegistro = (e) => {
    e.preventDefault();
    
    // Validación básica para que las contraseñas sean iguales
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden. Inténtalo de nuevo.');
      return;
    }

    // 1. Traer los usuarios que ya existen en la memoria (o un arreglo vacío si no hay)
    const usuariosActuales = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // 2. Opcional pero recomendado: evitar correos duplicados
    const correoExiste = usuariosActuales.find(user => user.email === email);
    if (correoExiste) {
      setError('Este correo ya está registrado. Intenta con otro o inicia sesión.');
      return;
    }

    // 3. Crear el objeto del nuevo usuario
    const nuevoUsuario = {
      id: usuariosActuales.length > 0 ? Math.max(...usuariosActuales.map(u => u.id)) + 1 : 1,
      nombre: nombre,
      email: email,
      password: password, // Se guarda para que el Login lo pueda validar después
      edad: edad,
      rol: "Cliente"      // Por defecto todos nacen como clientes
    };

    // 4. Agregar a la lista y guardar en LocalStorage
    const nuevaLista = [...usuariosActuales, nuevoUsuario];
    localStorage.setItem('usuarios', JSON.stringify(nuevaLista));

    setError('');
    alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
    navigate('/login');
  };
  
  return (
    <section className="registro-seccion">
      <div className="registro-contenedor shadow">
        <h2>Crea tu Cuenta</h2>
        <p>Únete a Llama la Óptica para gestionar tus pedidos.</p>
        
        {error && <div className="registro-error">{error}</div>}

        <form onSubmit={handleRegistro} className="registro-formulario">
          <input 
            type="text" 
            placeholder="Nombre completo" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required 
          />

          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />

          <input 
            type="number" 
            placeholder="Edad" 
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            required 
            min="14"
            />
          
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />

          <input 
            type="password" 
            placeholder="Confirmar contraseña" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
          
          <button type="submit" className="btn-registrar mt-3">
            Registrarme
          </button>
        </form>

        <div className="registro-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </section>
  );
}