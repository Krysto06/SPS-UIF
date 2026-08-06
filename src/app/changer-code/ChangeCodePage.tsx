import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { changerCode, seDeconnecter } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

export default function ChangeCodePage() {
  const { profil, rafraichirProfil } = useAuth();
  const navigate = useNavigate();
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  const force = profil?.doit_changer_code === true;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErreur('');
    if (code1.length < 6) {
      setErreur('Le code doit contenir au moins 6 caractères.');
      return;
    }
    if (code1 !== code2) {
      setErreur('Les deux codes ne correspondent pas.');
      return;
    }
    setEnvoi(true);
    try {
      await changerCode(code1);
      await rafraichirProfil();
      navigate('/');
    } catch {
      setErreur('Impossible de changer le code. Réessayez.');
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
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

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl border-t-4 border-yellow-400 px-8 py-10">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-blue-900 tracking-wide">
                {force ? 'Première connexion' : 'Changer mon code'}
              </h2>
              <div className="mx-auto mt-3 h-px w-16 bg-yellow-400" />
              <p className="text-sm text-slate-500 mt-3">
                {force
                  ? `Bonjour ${profil?.prenom}, veuillez choisir votre code personnel.`
                  : 'Choisissez un nouveau code personnel.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Nouveau code
                </label>
                <input
                  type="password"
                  value={code1}
                  onChange={(e) => setCode1(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-800 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-yellow-400/40 transition"
                  placeholder="min. 6 caractères"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Confirmer le code
                </label>
                <input
                  type="password"
                  value={code2}
                  onChange={(e) => setCode2(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-800 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-yellow-400/40 transition"
                  placeholder="répéter le code"
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
                className="w-full bg-blue-900 hover:bg-blue-800 text-yellow-400 font-semibold uppercase tracking-wider text-sm rounded-md py-3 transition disabled:opacity-50"
              >
                {envoi ? 'Enregistrement…' : 'Valider mon code'}
              </button>
            </form>

            {force ? (
              <button
                onClick={() => seDeconnecter()}
                className="w-full text-xs text-slate-400 mt-4 hover:text-slate-600 transition"
              >
                Se déconnecter
              </button>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="w-full text-xs text-slate-400 mt-4 hover:text-slate-600 transition"
              >
                Annuler et revenir à l'accueil
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
