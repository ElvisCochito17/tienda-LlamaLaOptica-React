import { useState } from 'react';

export default function Contacto() {
  // Estado para guardar los datos ingresados
  const [formulario, setFormulario] = useState({
    email: '',
    asunto: '',
    mensaje: '',
    edad: '',
    sexo: ''
  });

  // Función que actualiza el estado cuando escribes
  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // Función para simular el envío
  const handleEnvio = (e) => {
    e.preventDefault();
    alert('¡Tu consulta fue enviada con éxito! Nos contactaremos pronto.');
    // Limpiar los campos después de enviar
    setFormulario({ email: '', asunto: '', mensaje: '', edad: '', sexo: '' });
  };

  // Función para el botón Limpiar
  const handleLimpiar = () => {
    setFormulario({ email: '', asunto: '', mensaje: '', edad: '', sexo: '' });
  };

  return (
    <main>
      <div className="Bienvenida">
        <h1>Cotiza o haz tu consulta con nosotros</h1>
        <p>Por favor diligencie el siguiente formulario para poder contactarlo y enviarle su cotización.</p>
      </div>    

      <section>
        <div className="Formulario-contenedor">
          <form onSubmit={handleEnvio}>
            <table>
              <tbody>
                <tr>
                  <td>Correo:</td>
                  <td>
                    <input type="email" name="email" value={formulario.email} onChange={handleChange} required placeholder="ingrese email" />
                  </td>
                </tr>
                <tr>
                  <td>Asunto + Nombre:</td>
                  <td>
                    <input type="text" name="asunto" value={formulario.asunto} onChange={handleChange} minLength="3" required placeholder="ingrese asunto" />
                  </td>
                </tr>
                <tr>
                  <td>Cotización:</td>
                  <td>
                    <textarea name="mensaje" value={formulario.mensaje} onChange={handleChange} cols="30" rows="6" required minLength="5" placeholder="Detalles o receta..."></textarea>
                  </td>
                </tr>
                <tr>
                  <td>Edad:</td>
                  <td>
                    <input type="number" name="edad" value={formulario.edad} onChange={handleChange} min="1" max="120" required />
                  </td>
                </tr>
                <tr>
                  <td>Sexo:</td>
                  <td>
                    <select name="sexo" value={formulario.sexo} onChange={handleChange} required>
                      <option value="">Seleccione...</option>
                      <option value="F">Femenino</option>
                      <option value="M">Masculino</option>
                      <option value="O">Otro</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="fila-botones">
                    <button type="button" onClick={handleLimpiar} className="btn-limpiar">Limpiar</button>
                    <button type="submit" className="btn-enviar">Enviar</button>
                    {/* Quité los botones antiguos de "Quitar lente" y "Listar" porque no corresponden a un formulario de contacto */}
                  </td>              
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </section>
    </main>
  );
}