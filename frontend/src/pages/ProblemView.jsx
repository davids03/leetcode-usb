import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../services/api';
import './ProblemView.css';

const starterCodeByLanguage = {
  python: `# Escribe tu solución aquí
import sys

# Ejemplo para suma de dos números:
# data = sys.stdin.read().strip().split()
# if len(data) >= 2:
#     a, b = map(int, data[:2])
#     print(a + b)

if __name__ == "__main__":
    # Lee toda la entrada
    data = sys.stdin.read().strip().split()
    if data:
        # Aquí va la lógica del problema
        pass
`,
  javascript: `// Escribe tu solución aquí
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    // Lógica según el problema
    console.log(line);
});
`,
  java: `// Escribe tu solución aquí
import java.util.Scanner;
class solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Lógica aquí
        sc.close();
    }
}
`,
  cpp: `// Escribe tu solución aquí
#include <iostream>
using namespace std;
int main() {
    // Lógica aquí
    return 0;
}
`
};

function ProblemView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [result, setResult] = useState(null);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.get(`/problems/${id}`);
        setProblem(response.data);
        setCode(starterCodeByLanguage[language] || starterCodeByLanguage.python);
      } catch (err) {
        setError('Error al cargar el problema');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(starterCodeByLanguage[language] || starterCodeByLanguage.python);
    }
  }, [language, problem]);

  const handleRunCode = async () => {
    setExecuting(true);
    setResult(null);
    try {
      const response = await api.post('/submissions/', {
        problem_id: parseInt(id),
        language,
        code
      });
      setResult(response.data);
    } catch (err) {
      setResult({
        status: 'error',
        message: err.response?.data?.msg || 'Error al ejecutar el código'
      });
    } finally {
      setExecuting(false);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="loading" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="problem-view">
      <div className="problem-header">
        <button className="back-button" onClick={() => navigate('/problems')}>← Volver a problemas</button>
        <h2 className="problem-title">{problem.title}</h2>
        <div style={{ width: '100px' }}></div>
      </div>
      <div className="main-content">
        <div className="description-panel">
          <div>
            <span className={`difficulty-tag difficulty-${problem.difficulty}`}>
              {problem.difficulty === 'easy' ? 'FÁCIL' : problem.difficulty === 'medium' ? 'MEDIO' : 'DIFÍCIL'}
            </span>
            <span className="category">Categoría: {problem.category}</span>
          </div>
          <div className="description-text">{problem.description}</div>
          <div className="test-cases-section">
            <h3> Datos de prueba (públicos)</h3>
            {problem.test_cases?.length > 0 ? (
              problem.test_cases.map((tc, idx) => (
                <div key={tc.id} className="test-case-card">
                  <div className="test-case-title">Ejemplo {idx+1}: {tc.description || `Caso ${idx+1}`}</div>
                  <div><strong>Entrada:</strong></div>
                  <pre className="test-case-pre">{tc.input}</pre>
                  <div><strong>Salida esperada:</strong></div>
                  <pre className="test-case-pre">{tc.expected_output}</pre>
                </div>
              ))
            ) : <p>No hay casos públicos disponibles.</p>}
          </div>
        </div>
        <div className="editor-panel">
          <div className="toolbar">
            <div>
              <label>Lenguaje: </label>
              <select className="language-selector" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="python">Python 3</option>
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <button className="execute-btn" onClick={handleRunCode} disabled={executing}>
              {executing ? 'Ejecutando...' : '▶ Ejecutar'}
            </button>
          </div>
          <Editor height="400px" language={language === 'python' ? 'python' : language === 'javascript' ? 'javascript' : language} value={code} onChange={(v) => setCode(v)} theme="vs-dark" options={{ fontSize: 14, minimap: { enabled: false } }} />
          
          {/* Resultados detallados */}
          {result && (
            <div className="result-panel">
              <h4>Resultados de la ejecución</h4>
              {result.results && result.results.length > 0 ? (
                <table className="result-table">
                  <thead>
                    <tr>
                      <th>Caso</th>
                      <th>Entrada</th>
                      <th>Esperado</th>
                      <th>Obtenido / Error</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.results.map((r, idx) => (
                      <tr key={r.test_case_id || idx}>
                        <td>{idx + 1}</td>
                        <td><pre className="result-pre">{r.input}</pre></td>
                        <td><pre className="result-pre">{r.expected}</pre></td>
                        <td>
                          {r.output ? <pre className="result-pre">{r.output}</pre> : null}
                          {r.error ? <span className="result-error">{r.error}</span> : null}
                          {!r.output && !r.error && <span className="result-empty">(sin salida)</span>}
                        </td>
                        <td>
                          {r.passed === true && <span className="result-passed"> Aprobado</span>}
                          {r.passed === false && <span className="result-failed"> Fallo</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <pre className="result-json">{JSON.stringify(result, null, 2)}</pre>
              )}
              <div className="result-summary">
                <strong>Estado global:</strong> {result.status === 'accepted' ? ' Todas las pruebas pasaron' : result.status === 'wrong_answer' ? ' Algunas pruebas fallaron' : result.status === 'compile_error' ? '⚠️ Error de compilación' : result.status === 'runtime_error' ? '💥 Error en ejecución' : result.status}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemView;