import { Outlet } from 'react-router-dom';
import AdminBarraLateral from '../componentes/AdminBarraLateral';
import '../css/administrador.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminLayout() {
  return (
    <div className="admin-contenedor">
      
      {/* Importamos tu nuevo componente de barra lateral */}
      <AdminBarraLateral />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Panel de Control Administrador</h1>
          <img src="/img/logo.png" alt="Logo Llama" className="logo-titulo" />
        </header>

        {/* Las vistas de usuarios, productos, etc. se inyectan aquí */}
        <Outlet />
      </main>
    </div>
  );
}