import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  // Obtener usuario del localStorage, manejar caso de inexistencia
  let user = { username: 'Usuario', role: 'student' };
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error('Error parsing user from localStorage', e);
  }

  const isAdmin = user.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/problems" className="logo">
          <span className="logo-icon"></span>
          <span className="logo-text">CodePlatform</span>
        </Link>
        {/* Solo mantenemos el enlace a Problems */}
        <div className="nav-links">
          <Link to="/problems" className="nav-link">Problems</Link>
        </div>
      </div>
      <div className="navbar-right">
        <span className="user-name">{user.username || 'Usuario'}</span>
        {isAdmin && (
          <>
            <Link to="/admin/logs" className="nav-link admin-link"> Admin</Link>
            <Link to="/admin/users" className="nav-link admin-link"> Usuarios</Link>
            <Link to="/admin/create-problem" className="nav-link admin-link"> Nuevo problema</Link>
          </>
        )}
        <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
      </div>
    </nav>
  );
}

export default Navbar;