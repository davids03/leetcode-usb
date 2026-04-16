import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../services/api';

// Mapeo de lenguajes a extensiones y códigos iniciales (por ahora manual)
const starterCodeByLanguage = {
  python: `# Escribe tu solución aquí
# Ejemplo de función para el problema:
def solve(a, b):
    return a + b

# O si el problema requiere leer entrada:
# import sys
# data = sys.stdin.read().strip().split()
# ...
`,
  javascript: `// Escribe tu solución aquí
function solve(a, b) {
    return a + b;
}
`,
  java: `// Escribe tu solución aquí
public class Main {
    public static void main(String[] args) {
        // Lee entrada y muestra salida
    }
}
`,
  cpp: `// Escribe tu solución aquí
#include <iostream>
using namespace std;

int main() {
    // Lee entrada y muestra salida
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
        // Establecer código inicial según el lenguaje actual
        setCode(starterCodeByLanguage[language] || '// Escribe tu código aquí');
      } catch (err) {
        setError('Error al cargar el problema');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  // Actualizar código cuando cambia el lenguaje (para mantener coherencia)
  useEffect(() => {
    if (problem) {
      setCode(starterCodeByLanguage[language] || '// Escribe tu código aquí');
    }
  }, [language]);

const handleRunCode = async () => {
  setExecuting(true);
  setResult(null);
  try {
    const response = await api.post('/submissions', {
      problem_id: id,   // Usa "id" (de useParams) y envíalo como "problem_id"
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

  if (loading) return <div style={{ padding: '20px' }}>Cargando...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
  if (!problem) return <div>Problema no encontrado</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #ddd', padding: '10px 20px' }}>
        <button onClick={() => navigate('/problems')} style={{ cursor: 'pointer' }}>← Volver a problemas</button>
      </div>

      <div style={{ display: 'flex', flex: 1, padding: '20px', gap: '20px' }}>
        {/* Panel izquierdo: Descripción y ejemplos */}
        <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
          <h1>{problem.title}</h1>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 
              problem.difficulty === 'easy' ? '#2c6e2c' : (problem.difficulty === 'medium' ? '#e67e22' : '#c0392b'), 
              color: '#fff', fontSize: '12px', marginRight: '10px' }}>
              {problem.difficulty.toUpperCase()}
            </span>
            <span style={{ fontSize: '14px', color: '#555' }}>Categoría: {problem.category}</span>
          </div>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{problem.description}</div>

          {/* Sección de Ejemplos (similar a LeetCode) */}
          <h3 style={{ marginTop: '30px' }}>📘 Ejemplos</h3>
          {problem.test_cases && problem.test_cases.length > 0 ? (
            <div>
              {problem.test_cases.map((tc, idx) => (
                <div key={tc.id} style={{ marginBottom: '20px', borderLeft: '4px solid #3498db', paddingLeft: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                  <strong>Ejemplo {idx + 1}:</strong> {tc.description || `Caso ${idx+1}`}
                  <div style={{ marginTop: '8px' }}>
                    <div><strong>Entrada:</strong></div>
                    <pre style={{ backgroundColor: '#eee', padding: '8px', borderRadius: '4px' }}>{tc.input}</pre>
                  </div>
                  <div>
                    <strong>Salida esperada:</strong>
                    <pre style={{ backgroundColor: '#eee', padding: '8px', borderRadius: '4px' }}>{tc.expected_output}</pre>
                  </div>
                  {tc.explanation && <div><strong>Explicación:</strong> {tc.explanation}</div>}
                </div>
              ))}
            </div>
          ) : (
            <p>No hay ejemplos disponibles.</p>
          )}

          {/* También se pueden agregar restricciones si las hay */}
          <h3>🔒 Restricciones</h3>
          <ul>
            <li>Los valores de entrada están dentro del rango de enteros de 32 bits.</li>
            <li>Tiempo límite: 1 segundo.</li>
          </ul>
        </div>

        {/* Panel derecho: Editor y ejecución */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <label style={{ marginRight: '10px' }}>Lenguaje:</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '5px' }}>
                  <option value="python">Python 3</option>
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <button 
                onClick={handleRunCode} 
                disabled={executing}
                style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: executing ? 0.6 : 1
                }}
              >
                {executing ? 'Ejecutando...' : '▶ Ejecutar'}
              </button>
            </div>
            <Editor
              height="400px"
              language={language === 'python' ? 'python' : language === 'javascript' ? 'javascript' : language}
              value={code}
              onChange={(value) => setCode(value)}
              theme="vs-dark"
              options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false }}
            />
          </div>

          {/* Resultado de la ejecución */}
          {result && (
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h4>Resultado:</h4>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemView;