import { Link } from 'react-router-dom';

export default function AdminBarraLateral() {
  return (
    <aside className="admin-sidebar" style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="admin-logo">
        <h2>Llama la Optica</h2>
      </div>
      
      <nav className="admin-nav" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <ul style={{ flexGrow: 1 }}>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/usuarios">Usuarios</Link></li>
          <li><Link to="/admin/productos">Productos</Link></li>
          <li><Link to="/admin/categorias">Categorías</Link></li>
          <li><Link to="/admin/ordenes">Órdenes</Link></li>
          <li><Link to="/admin/reportes">Reportes</Link></li>
          <li><Link to="/admin/perfil">Perfil</Link></li>
        </ul>

        <div style={{ padding: '20px', borderTop: '1px solid #333', textAlign: 'center', marginTop: 'auto' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#198754', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '20px', fontWeight: 'bold' }}>
            GT
          </div>
          <p style={{ color: 'white', margin: '0', fontWeight: 'bold', fontSize: '15px' }}>Gabriel Tapia</p>
          <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '15px' }}>Administrador</p>
          
          <Link to="/" style={{ color: '#ff6b6b', textDecoration: 'none', fontSize: '14px', display: 'block', padding: '8px', border: '1px solid #333', borderRadius: '5px' }}>
            Volver a la Tienda
          </Link>
        </div>
      </nav>
    </aside>
  );
}