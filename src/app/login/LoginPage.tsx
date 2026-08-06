import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { seConnecter } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const navigate = useNavigate();
  const { rafraichirProfil } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      await seConnecter(username, code);
      await rafraichirProfil();
      navigate('/');
    } catch {
      setErreur('Identifiant ou code incorrect.');
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      {/* En-tête institutionnel */}
      <header className="bg-blue-900 border-b-4 border-yellow-400">
        <div className="max-w-4xl mx-auto px-6 py-5 text-center">
          <h1 className="text-white font-semibold tracking-[0.2em] text-sm sm:text-base uppercase">
            Banque de la République d'Haïti
          </h1>
          <p className="text-yellow-400 text-xs sm:text-sm tracking-[0.15em] uppercase mt-1">
            Unité d'Inclusion Financière
          </p>
        </div>
      </header>

      {/* Corps */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl border-t-4 border-yellow-400 px-8 py-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-900 mb-4">
                <span className="text-yellow-400 font-bold text-lg tracking-tight">
                  SPS
                </span>
              </div>
              <h2 className="text-xl font-semibold text-blue-900 tracking-wide">
                Système de Pilotage Stratégique
              </h2>
              <div className="mx-auto mt-3 h-px w-16 bg-yellow-400" />
              <p className="text-sm text-slate-500 mt-3">
                Accès réservé aux cadres de l'Unité
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Identifiant
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-800 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-yellow-400/40 transition"
                  placeholder="ex : jdupont"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Code d'accès
                </label>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-800 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-yellow-400/40 transition"
                  placeholder="••••••••"
                />
              </div>

              {erreur && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {erreur}
                </p>
              )}

              <button
                type="submit"
                disabled={envoi}
                className="w-full bg-blue-900 hover:bg-blue-800 text-yellow-400 font-semibold uppercase tracking-wider text-sm rounded-md py-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {envoi ? 'Connexion en cours…' : 'Se connecter'}
              </button>
            </form>
          </div>

          {/* Note de positionnement */}
          <p className="text-center text-xs text-slate-600 leading-relaxed mt-6 px-2">
            Cet outil ne remplace pas Bitrix. Il constitue un instrument de suivi
            du travail trimestriel de l'Unité d'Inclusion Financière.
          </p>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="border-t border-sky-200 py-4">
        <p className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Banque de la République d'Haïti — Unité
          d'Inclusion Financière
        </p>
      </footer>
    </div>
  );
}
