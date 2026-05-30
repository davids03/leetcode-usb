import { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = roleFilter ? `?role=${roleFilter}` : '';
      const response = await api.get(`/admin/users${params}`);
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-users-container">
      <h2> Usuarios registrados</h2>
      <div className="filter-bar">
        <label>Filtrar por rol: </label>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">Todos</option>
          <option value="student">Estudiantes</option>
          <option value="admin">Administradores</option>
        </select>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Fecha de registro</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td className={user.role === 'admin' ? 'role-admin' : 'role-student'}>
                {user.role === 'admin' ? 'Administrador' : 'Estudiante'}
              </td>
              <td>{new Date(user.created_at).toLocaleDateString()} {new Date(user.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;