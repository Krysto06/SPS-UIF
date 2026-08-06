import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { seDeconnecter } from '../../services/authService';

export default function DashboardPage() {
  const { profil } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <header className="bg-blue-900 border-b-4 border-yellow-400">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold tracking-[0.15em] text-xs uppercase">
              Banque de la République d'Haïti
            </p>
            <p className="text-yellow-400 text-xs tracking-[0.1em] uppercase">
              Unité d'Inclusion Financière
            </p>
          </div>
          <button
            onClick={() => seDeconnecter()}
            className="text-xs text-white border border-white/40 rounded px-3 py-1.5 hover:bg-white/10 transition"
          >
            Se déconnecter
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow border-t-4 border-yellow-400 p-8">
          <h1 className="text-2xl font-semibold text-blue-900">
            Bienvenue, {profil?.prenom} {profil?.nom}
          </h1>
          <p className="text-slate-500 mt-2">
            Rôle :{' '}
            <span className="font-medium text-slate-700">{profil?.role}</span>
          </p>

          {profil?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="mt-6 inline-block bg-blue-900 hover:bg-blue-800 text-yellow-400 font-semibold text-sm rounded-md px-5 py-2.5 transition"
            >
              Gestion des utilisateurs
            </button>
          )}

          <div className="mt-6 h-px bg-slate-200" />
          <p className="text-sm text-slate-500 mt-6">
            Les modules seront ajoutés ici progressivement.
          </p>
        </div>
      </main>

      <footer className="border-t border-sky-200 py-4">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-center">
          <button
            onClick={() => navigate('/changer-code')}
            className="text-xs text-slate-500 hover:text-blue-900 underline underline-offset-2 transition"
          >
            Changer mon code
          </button>
        </div>
      </footer>
    </div>
  );
}
