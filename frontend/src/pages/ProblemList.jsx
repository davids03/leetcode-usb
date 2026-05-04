import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './ProblemList.css';

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const url = difficulty ? `/problems/?difficulty=${difficulty}` : '/problems/';
        const response = await api.get(url);
        setProblems(response.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los problemas. Verifica tu conexión.');
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [difficulty]);

  if (loading) return <div className="loading">Cargando problemas...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="problem-list-container">
      <h2> Lista de Problemas</h2>
      <div className="filter-bar">
        <label>Filtrar por dificultad:</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">Todas</option>
          <option value="easy">Fácil</option>
          <option value="medium">Medio</option>
          <option value="hard">Difícil</option>
        </select>
      </div>
      {problems.length === 0 ? (
        <p>No hay problemas que mostrar.</p>
      ) : (
        <table className="problem-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Dificultad</th>
              <th>Categoría</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.id}>
                <td>{problem.id}</td>
                <td>
                  <Link to={`/problems/${problem.id}`}>{problem.title}</Link>
                </td>
                <td>
                  <span className={`difficulty-badge difficulty-${problem.difficulty}`}>
                    {problem.difficulty === 'easy'
                      ? 'Fácil'
                      : problem.difficulty === 'medium'
                      ? 'Medio'
                      : 'Difícil'}
                  </span>
                </td>
                <td>{problem.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProblemList;