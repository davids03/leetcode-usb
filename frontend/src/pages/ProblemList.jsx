import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function ProblemList() {
  console.log('ProblemList montado');
  const [problems, setProblems] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProblems = async (filter = '') => {
    setLoading(true);
    try {
      const url = filter ? `/problems/?difficulty=${filter}` : '/problems/';
      const response = await api.get(url);
      setProblems(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems(difficulty);
  }, [difficulty]);

  const getDifficultyColor = (diff) => {
    if (diff === 'easy') return 'green';
    if (diff === 'medium') return 'orange';
    return 'red';
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Problemas Disponibles</h2>
      <div>
        <label>Filtrar por dificultad: </label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">Todas</option>
          <option value="easy">Fácil</option>
          <option value="medium">Medio</option>
          <option value="hard">Difícil</option>
        </select>
      </div>
      {loading && <p>Cargando...</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr><th>ID</th><th>Título</th><th>Dificultad</th><th>Categoría</th><th>Acción</th></tr>
        </thead>
        <tbody>
          {problems.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td style={{ color: getDifficultyColor(p.difficulty) }}>{p.difficulty}</td>
              <td>{p.category}</td>
              <td><Link to={`/problems/${p.id}`}>Ver</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProblemList;