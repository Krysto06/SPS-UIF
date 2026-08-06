import { useAuth } from '../../hooks/useAuth';
import { seDeconnecter } from '../../services/authService';

export default function DashboardPage() {
  const { profil } = useAuth();

  return (
    <div className="min-h-screen bg-sky-100">
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

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow border-t-4 border-yellow-400 p-8">
          <h1 className="text-2xl font-semibold text-blue-900">
            Bienvenue, {profil?.prenom} {profil?.nom}
          </h1>
          <p className="text-slate-500 mt-2">
            Rôle :{' '}
            <span className="font-medium text-slate-700">{profil?.role}</span>
          </p>
          <div className="mt-6 h-px bg-slate-200" />
          <p className="text-sm text-slate-500 mt-6">
            Les modules seront ajoutés ici progressivement.
          </p>
        </div>
      </main>
    </div>
  );
}
