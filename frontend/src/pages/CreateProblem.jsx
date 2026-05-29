import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './CreateProblem.css';

function CreateProblem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    category: '',
  });
  const [testCases, setTestCases] = useState([
    { input: '', expected_output: '', is_public: true, description: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expected_output: '', is_public: true, description: '' }]);
  };

  const removeTestCase = (index) => {
    if (testCases.length > 1) {
      const updated = testCases.filter((_, i) => i !== index);
      setTestCases(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...formData,
        test_cases: testCases
      };
      await api.post('/admin/problems/', payload);
      setSuccess('Problema creado exitosamente');
      setTimeout(() => navigate('/problems'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al crear problema');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-problem-container">
      <h2> Agregar nuevo problema</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título *</label>
          <input type="text" name="title" value={formData.title} onChange={handleFormChange} required />
        </div>
        <div className="form-group">
          <label>Descripción *</label>
          <textarea name="description" rows="5" value={formData.description} onChange={handleFormChange} required />
        </div>
        <div className="form-group">
          <label>Categoría *</label>
          <input type="text" name="category" value={formData.category} onChange={handleFormChange} required />
        </div>
        <div className="form-group">
          <label>Dificultad *</label>
          <select name="difficulty" value={formData.difficulty} onChange={handleFormChange}>
            <option value="easy">Fácil</option>
            <option value="medium">Medio</option>
            <option value="hard">Difícil</option>
          </select>
        </div>

        <h3> Casos de prueba</h3>
        {testCases.map((tc, idx) => (
          <div key={idx} className="test-case-card">
            <h4>Caso {idx + 1}</h4>
            <div className="form-group">
              <label>Entrada *</label>
              <textarea rows="2" value={tc.input} onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Salida esperada *</label>
              <textarea rows="2" value={tc.expected_output} onChange={(e) => handleTestCaseChange(idx, 'expected_output', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Descripción (opcional)</label>
              <input type="text" value={tc.description} onChange={(e) => handleTestCaseChange(idx, 'description', e.target.value)} />
            </div>
            <div className="form-group checkbox">
              <label>
                <input type="checkbox" checked={tc.is_public} onChange={(e) => handleTestCaseChange(idx, 'is_public', e.target.checked)} />
                Público (visible por estudiantes)
              </label>
            </div>
            {testCases.length > 1 && (
              <button type="button" className="remove-btn" onClick={() => removeTestCase(idx)}>Eliminar caso</button>
            )}
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addTestCase}>+ Agregar caso de prueba</button>

        <div className="form-actions">
          <button type="submit" disabled={loading}>Crear problema</button>
          <button type="button" onClick={() => navigate('/problems')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default CreateProblem;