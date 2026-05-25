import { useState, useEffect } from 'react';
import api from '../services/api';

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ username: '', action: '', start_date: '', end_date: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/logs?${params}`);
      setLogs(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al cargar logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  if (loading) return <div style={{ padding: '20px' }}>Cargando historial...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Historial del sistema</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input name="username" placeholder="Usuario" value={filters.username} onChange={handleFilterChange} />
        <input name="action" placeholder="Acción (login, submission, ...)" value={filters.action} onChange={handleFilterChange} />
        <input name="start_date" type="date" value={filters.start_date} onChange={handleFilterChange} />
        <input name="end_date" type="date" value={filters.end_date} onChange={handleFilterChange} />
        <button type="submit">Filtrar</button>
      </form>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Fecha</th><th>Usuario</th><th>Acción</th><th>Detalles</th><th>IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay registros</td></tr>
          ) : (
            logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.created_at).toLocaleString()}</td>
                <td>{log.username}</td>
                <td>{log.action}</td>
                <td>{log.details || '-'}</td>
                <td>{log.ip_address || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminLogs;