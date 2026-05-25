import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProblemList from './pages/ProblemList';
import ProblemView from './pages/ProblemView';
import AdminLogs from './pages/AdminLogs';

function App() {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/problems" element={isAuthenticated ? <ProblemList /> : <Navigate to="/login" />} />
        <Route path="/problems/:id" element={isAuthenticated ? <ProblemView /> : <Navigate to="/login" />} />
        <Route path="/admin/logs" element={isAdmin ? <AdminLogs /> : <Navigate to="/problems" />} />
        <Route path="/" element={<Navigate to="/problems" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;