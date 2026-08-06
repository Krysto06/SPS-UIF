import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './app/login/LoginPage';
import DashboardPage from './app/dashboard/DashboardPage';
import AdminPage from './app/admin/AdminPage';

function Routage() {
  const { profil, chargement } = useAuth();

  if (chargement) {
    return (
      <div className="min-h-screen bg-sky-100 flex items-center justify-center">
        <p className="text-blue-900">Chargement…</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/connexion"
        element={profil ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={profil ? <DashboardPage /> : <Navigate to="/connexion" replace />}
      />
      <Route
        path="/admin"
        element={
          profil && profil.role === 'admin' ? (
            <AdminPage />
          ) : (
            <Navigate to="/" replace />
          )
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
