import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/contacto.css';

export default function Contacto() {
  const [formulario, setFormulario] = useState({
    email: '',
    asunto: '',
    mensaje: '',
    edad: '',
    sexo: '',
    receta: null
  });

  const [enviadoConExito, setEnviadoConExito] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormulario({
      ...formulario,
      [name]: files ? files[0] : value
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFormulario({
        ...formulario,
        receta: e.dataTransfer.files[0]
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleEnvio = (e) => {
    e.preventDefault();
    setEnviadoConExito(true);
  };

  const handleLimpiar = () => {
    setFormulario({ email: '', asunto: '', mensaje: '', edad: '', sexo: '', receta: null });
  };

  if (enviadoConExito) {
    return (
      <main className="contacto-pagina">
        <div className="exito-card" style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center", background: "#fff", padding: "3rem", borderRadius: "20px", boxShadow: "0 10px 30px rgba(46, 90, 68, 0.08)" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>✉️</div>
          <h1 style={{ color: "#2e5a44", marginBottom: "1rem", fontSize: "1.8rem" }}>¡Su mensaje se ha enviado con éxito!</h1>
          <p style={{ color: "#555", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: "2rem" }}>
            Recibirá respuesta, dependiendo de su asunto, de <strong>1 a 4 días hábiles</strong> en su correo <strong>{formulario.email}</strong> En caso
            de no recibir respuesta, por favor contáctenos al número de teléfono, <strong>asegurese de mirar su bandeja de spam </strong>.
          </p>
          <Link to="/" className="btn-catalogo" style={{ display: "inline-block", backgroundColor: "#2e5a44", color: "#fff", padding: "12px 28px", borderRadius: "10px", fontWeight: "600", textDecoration: "none" }}>
            Volver al Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="contacto-pagina">
      <section className="contacto-hero">
        <h1>Cotiza o haz tu consulta</h1>
        <p>
          En Llama la Óptica te asesoramos con la receta de tus lentes o tus dudas. 
          Rellena el formulario y adjunta tu receta si lo deseas.
        </p>
      </section>

      <div className="contacto-grid-contenedor">
        <aside className="contacto-info-card">
          <h2>Información de Atención</h2>
          <p className="info-subtext">Visítanos en nuestra sucursal o contáctanos por nuestros canales oficiales.</p>
          
          <div className="info-items">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <strong>Dirección</strong>
                <p>Av. España 8, Santiago, Chile</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <strong>Teléfono / WhatsApp</strong>
                <p>+56 9 1234 5678</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">✉️</span>
              <div>
                <strong>Correo Electrónico</strong>
                <p>contacto@llamalaoptica.cl</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">🕒</span>
              <div>
                <strong>Horario de Atención</strong>
                <p>Lunes a Viernes: 10:00 - 19:00 hrs</p>
                <p>Sábados: 10:00 - 14:00 hrs</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="Formulario-contenedor">
          <form onSubmit={handleEnvio} className="contacto-form">
            <h2>Envíanos un mensaje</h2>

            <div className="campo-grupo">
              <label htmlFor="email">Correo electrónico *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formulario.email}
                onChange={handleChange}
                required
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="campo-grupo">
              <label htmlFor="asunto">Asunto + Nombre *</label>
              <input
                id="asunto"
                type="text"
                name="asunto"
                value={formulario.asunto}
                onChange={handleChange}
                minLength="3"
                required
                placeholder="Ej: Cotización receta - Juan Pérez"
              />
            </div>

            <div className="fila-doble">
              <div className="campo-grupo">
                <label htmlFor="edad">Edad *</label>
                <input
                  id="edad"
                  type="number"
                  name="edad"
                  value={formulario.edad}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  required
                  placeholder="Ej: 25"
                  // Validación personalizada en español para el navegador
                  onInvalid={(e) => {
                    if (e.target.validity.valueMissing) {
                      e.target.setCustomValidity('Por favor, completa este campo.');
                    } else if (e.target.validity.rangeUnderflow || e.target.validity.rangeOverflow) {
                      e.target.setCustomValidity('Por favor, ingresa una edad válida entre 1 y 120 años.');
                    } else {
                      e.target.setCustomValidity('');
                    }
                  }}
                  onInput={(e) => e.target.setCustomValidity('')}
                />
              </div>

              <div className="campo-grupo">
                <label htmlFor="sexo">Sexo *</label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formulario.sexo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="F">Femenino</option>
                  <option value="M">Masculino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
            </div>

            <div className="campo-grupo">
              <label htmlFor="mensaje">Detalles de la Cotización o Receta *</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formulario.mensaje}
                onChange={handleChange}
                cols="30"
                rows="4"
                required
                minLength="5"
                placeholder="Describe tus medidas o dudas..."
              ></textarea>
            </div>

            {/* Campo para adjuntar archivo con soporte de vista previa para imágenes y PDFs */}
            <div className="campo-grupo">
              <label htmlFor="receta">Adjuntar Receta o Foto (Opcional)</label>
              <div 
                className="custom-file-wrapper"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  id="receta"
                  type="file"
                  name="receta"
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  className="input-archivo-oculto"
                />
                <label htmlFor="receta" className="btn-custom-file">
                  📁 {formulario.receta ? formulario.receta.name : "Arrastra tu archivo aquí o haz clic"}
                </label>
              </div>

              {/* Vista previa / Miniatura para imágenes o PDFs */}
              {formulario.receta && (
                <div style={{ marginTop: "12px", textAlign: "center" }}>
                  {formulario.receta.type.startsWith("image/") ? (
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <img 
                        src={URL.createObjectURL(formulario.receta)} 
                        alt="Vista previa receta" 
                        style={{ maxWidth: "100%", maxHeight: "160px", borderRadius: "8px", border: "1px solid #ccc" }} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setFormulario({ ...formulario, receta: null })}
                        style={{ display: "block", margin: "6px auto 0 auto", background: "#8b0000", color: "#fff", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" }}
                      >
                        Quitar imagen
                      </button>
                    </div>
                  ) : formulario.receta.type === "application/pdf" ? (
                    <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                      <iframe 
                        src={URL.createObjectURL(formulario.receta)} 
                        title="Vista previa PDF"
                        style={{ width: "100%", height: "220px", borderRadius: "8px", border: "1px solid #ccc" }}
                      />
                      <button 
                        type="button" 
                        onClick={() => setFormulario({ ...formulario, receta: null })}
                        style={{ display: "block", margin: "6px auto 0 auto", background: "#8b0000", color: "#fff", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" }}
                      >
                        Quitar PDF
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "0.9rem", color: "#2e5a44", fontWeight: "600" }}>
                        📄 Archivo adjunto: {formulario.receta.name}
                      </p>
                      <button 
                        type="button" 
                        onClick={() => setFormulario({ ...formulario, receta: null })}
                        style={{ background: "#8b0000", color: "#fff", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" }}
                      >
                        Quitar archivo
                      </button>
                    </div>
                  )}
                </div>
              )}

              <small style={{ color: "#666", marginTop: "6px", display: "block" }}>Formatos permitidos: Imágenes o PDF.</small>
            </div>

            <div className="fila-botones">
              <button type="button" onClick={handleLimpiar} className="btn-limpiar">
                Limpiar
              </button>
              <button type="submit" className="btn-enviar">
                Enviar Mensaje
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}