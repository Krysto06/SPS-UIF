import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './app/login/LoginPage';
import DashboardPage from './app/dashboard/DashboardPage';
import AdminPage from './app/admin/AdminPage';
import ChangeCodePage from './app/changer-code/ChangeCodePage';

function Routage() {
  const { profil, chargement } = useAuth();

  if (chargement) {
    return (
      <div className="min-h-screen bg-sky-100 flex items-center justify-center">
        <p className="text-blue-900">Chargement…</p>
      </div>
    );
  }

  if (!profil) {
    return (
      <Routes>
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/connexion" replace />} />
      </Routes>
    );
  }

  if (profil.doit_changer_code) {
    return (
      <Routes>
        <Route path="/changer-code" element={<ChangeCodePage />} />
        <Route path="*" element={<Navigate to="/changer-code" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/changer-code" element={<ChangeCodePage />} />
      <Route
        path="/admin"
        element={
          profil.role === 'admin' ? <AdminPage /> : <Navigate to="/" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routage />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
