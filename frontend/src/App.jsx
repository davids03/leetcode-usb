import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProblemList from './pages/ProblemList';
import ProblemView from './pages/ProblemView';
import AdminLogs from './pages/AdminLogs';
import CreateProblem from './pages/CreateProblem';
import Navbar from './components/Navbar';
import Register from './pages/Register';

function App() {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/problems" element={isAuthenticated ? <ProblemList /> : <Navigate to="/login" />} />
        <Route path="/problems/:id" element={isAuthenticated ? <ProblemView /> : <Navigate to="/login" />} />
        <Route path="/admin/logs" element={isAuthenticated && isAdmin ? <AdminLogs /> : <Navigate to="/problems" />} />
        <Route path="/admin/create-problem" element={isAuthenticated && isAdmin ? <CreateProblem /> : <Navigate to="/problems" />} />
        <Route path="/contest" element={isAuthenticated ? <div>Contest - Próximamente</div> : <Navigate to="/login" />} />
        <Route path="/discuss" element={isAuthenticated ? <div>Discuss - Próximamente</div> : <Navigate to="/login" />} />
        <Route path="/interview" element={isAuthenticated ? <div>Interview - Próximamente</div> : <Navigate to="/login" />} />
        <Route path="/store" element={isAuthenticated ? <div>Store - Próximamente</div> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/problems" />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;