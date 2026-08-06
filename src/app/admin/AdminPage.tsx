import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { seDeconnecter } from '../../services/authService';
import { creerUtilisateur, listerUtilisateurs } from '../../services/adminService';
import type { Profil } from '../../types/user';

export default function AdminPage() {
  const navigate = useNavigate();
  const [utilisateurs, setUtilisateurs] = useState<Profil[]>([]);
  const [username, setUsername] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [titre, setTitre] = useState('');
  const [role, setRole] = useState('cadre');
  const [code, setCode] = useState('');
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [envoi, setEnvoi] = useState(false);

  async function chargerListe() {
    try {
      setUtilisateurs(await listerUtilisateurs());
    } catch {
      setErreur('Impossible de charger la liste des utilisateurs.');
    }
  }

  useEffect(() => {
    chargerListe();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErreur('');
    setSucces('');
    setEnvoi(true);
    try {
      await creerUtilisateur({ username, nom, prenom, titre, role, code });
      setSucces(`Compte « ${prenom} ${nom} » créé avec succès.`);
      setUsername('');
      setNom('');
      setPrenom('');
      setTitre('');
      setRole('cadre');
      setCode('');
      await chargerListe();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally {
      setEnvoi(false);
    }
  }

  const roleLabel: Record<string, string> = {
    cadre: 'Cadre',
    directrice: 'Directrice',
    admin: 'Gestionnaire',
  };

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
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-white border border-white/40 rounded px-3 py-1.5 hover:bg-white/10 transition"
            >
              Accueil
            </button>
            <button
              onClick={() => seDeconnecter()}
              className="text-xs text-white border border-white/40 rounded px-3 py-1.5 hover:bg-white/10 transition"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-blue-900">
            Gestion des utilisateurs
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Créer et consulter les comptes des cadres, de la directrice et des
            gestionnaires.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow border-t-4 border-yellow-400 p-6">
          <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wider mb-4">
            Nouveau compte
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Champ label="Prénom" value={prenom} onChange={setPrenom} />
            <Champ label="Nom" value={nom} onChange={setNom} />
            <Champ
              label="Titre / Fonction"
              value={titre}
              onChange={setTitre}
              required={false}
              placeholder="ex : Chargé de projet"
            />
            <Champ
              label="Identifiant"
              value={username}
              onChange={setUsername}
              placeholder="ex : jdupont"
            />
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Rôle
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-800 bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-yellow-400/40 transition"
              >
                <option value="cadre">Cadre</option>
                <option value="directrice">Directrice</option>
                <option value="admin">Gestionnaire de données</option>
              </select>
            </div>
            <Champ
              label="Code temporaire"
              value={code}
              onChange={setCode}
              type="password"
              placeholder="min. 6 caractères"
            />

            <div className="sm:col-span-2 flex flex-wrap items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={envoi}
                className="bg-blue-900 hover:bg-blue-800 text-yellow-400 font-semibold uppercase tracking-wider text-sm rounded-md px-6 py-2.5 transition disabled:opacity-50"
              >
                {envoi ? 'Création…' : 'Créer le compte'}
              </button>
              {succes && <p className="text-sm text-green-700">{succes}</p>}
              {erreur && <p className="text-sm text-red-700">{erreur}</p>}
            </div>
          </form>
          <p className="text-xs text-slate-400 mt-4">
            Le cadre devra changer ce code temporaire à sa première connexion.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow border-t-4 border-yellow-400 p-6">
          <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wider mb-4">
            Utilisateurs existants ({utilisateurs.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-4 font-medium">Nom</th>
                  <th className="py-2 pr-4 font-medium">Titre</th>
                  <th className="py-2 pr-4 font-medium">Identifiant</th>
                  <th className="py-2 pr-4 font-medium">Rôle</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4 text-slate-800">
                      {u.prenom} {u.nom}
                    </td>
                    <td className="py-2 pr-4 text-slate-600">{u.titre ?? '—'}</td>
                    <td className="py-2 pr-4 text-slate-600">{u.username}</td>
                    <td className="py-2 pr-4">
                      <span className="inline-block text-xs px-2 py-0.5 rounded bg-sky-100 text-blue-900">
                        {roleLabel[u.role] ?? u.role}
                      </span>
                    </td>
                  </tr>
                ))}
                {utilisateurs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-slate-400 text-center">
                      Aucun utilisateur.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function Champ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-800 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-yellow-400/40 transition"
      />
    </div>
  );
}
