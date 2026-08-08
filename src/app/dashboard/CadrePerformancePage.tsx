import { useEffect, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { seDeconnecter } from '../../services/authService';
import {
  actionsDuTrimestre,
  calculerScore,
  performanceTrimestre,
  trimestreActuel,
} from '../../services/performanceService';
import type { ActionLigne } from '../../services/performanceService';

const STATUTS: Record<string, { label: string; fond: string; texte: string }> = {
  en_attente: { label: 'En attente', fond: '#f1f5f9', texte: '#475569' },
  en_cours: { label: 'En cours', fond: '#dbeafe', texte: '#1d4ed8' },
  termine: { label: 'Terminé', fond: '#d1fae5', texte: '#047857' },
  bloque: { label: 'Retard', fond: '#fee2e2', texte: '#b91c1c' },
};

function alerte(a: ActionLigne) {
  if (a.statut === 'termine') return { couleur: '#10b981', label: 'Terminé' };
  const jours = Math.ceil(
    (new Date(a.echeance).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (jours < 0) return { couleur: '#dc2626', label: 'En retard' };
  if (a.pourcentage < 30 && jours < 7) return { couleur: '#fb923c', label: 'Retard probable' };
  if (a.pourcentage < 50 && jours < 15) return { couleur: '#facc15', label: 'Risque de retard' };
  return { couleur: '#10b981', label: 'Dans les temps' };
}

function Jauge({ score, statut }: { score: number; statut: string }) {
  const size = 108;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#gold)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.7s ease' }}
        />
        <defs>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f7e08a" />
            <stop offset="100%" stopColor="#c8a54e" />
          </linearGradient>
        </defs>
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
          {score}
          <span style={{ fontSize: 15 }}>%</span>
        </span>
        <span
          style={{
            fontSize: 9,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#fcd34d',
            marginTop: 4,
          }}
        >
          {statut}
        </span>
      </div>
    </div>
  );
}

export default function CadrePerformancePage() {
  const { profil } = useAuth();
  const navigate = useNavigate();
  const [actions, setActions] = useState<ActionLigne[]>([]);
  const [statutScore, setStatutScore] = useState<'provisoire' | 'valide' | 'ajuste'>('provisoire');
  const [scoreValide, setScoreValide] = useState<number | null>(null);
  const [chargement, setChargement] = useState(true);
  const [ouvert, setOuvert] = useState(true);

  const trimestre = trimestreActuel();

  useEffect(() => {
    if (!profil) return;
    (async () => {
      try {
        setActions(await actionsDuTrimestre(profil.id, trimestre));
        const perf = await performanceTrimestre(profil.id, trimestre);
        if (perf) {
          setStatutScore(perf.statut);
          setScoreValide(perf.score_final ?? null);
        }
      } finally {
        setChargement(false);
      }
    })();
  }, [profil, trimestre]);

  const scoreProvisoire = calculerScore(actions);
  const score = statutScore === 'provisoire' ? scoreProvisoire : scoreValide ?? scoreProvisoire;
  const compte = (s: string) => actions.filter((a) => a.statut === s).length;

  const trimestreLisible = (() => {
    const [t, annee] = trimestre.split('-');
    const libelles: Record<string, string> = {
      T1: 'Trimestre 1 · Jan–Mars',
      T2: 'Trimestre 2 · Avr–Juin',
      T3: 'Trimestre 3 · Juil–Sept',
      T4: 'Trimestre 4 · Oct–Déc',
    };
    return `${libelles[t] ?? t} ${annee}`;
  })();

  const statutTexte = { provisoire: 'Provisoire', valide: 'Validé', ajuste: 'Ajusté' }[statutScore];

  const stats = [
    { valeur: compte('en_cours'), libelle: 'En cours' },
    { valeur: compte('termine'), libelle: 'Terminées' },
    { valeur: compte('bloque'), libelle: 'En retard' },
    { valeur: compte('en_attente'), libelle: 'En attente' },
  ];

  const carte: CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <header className="bg-blue-900 border-b-4 border-yellow-400">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <main style={{ flex: 1, width: '100%', maxWidth: 896, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: '#1e3a8a' }}>
            Ma performance au sein de l'Unité
          </h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>
            {profil?.prenom} {profil?.nom}
            {profil?.titre ? ` · ${profil.titre}` : ''}
          </p>
        </div>

        {chargement ? (
          <p style={{ color: '#64748b' }}>Chargement…</p>
        ) : (
          <>
            <section
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(10,24,52,0.25)',
                background: 'linear-gradient(135deg, #0a1834 0%, #16305e 100%)',
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, rgba(200,165,78,0.8), transparent)',
                }}
              />
              <div style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <Jauge score={score} statut={statutTexte} />
                <div style={{ minWidth: 160 }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#fcd34d' }}>
                    Performance trimestrielle
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginTop: 4 }}>
                    {trimestreLisible}
                  </p>
                </div>
                <div style={{ display: 'flex', marginLeft: 'auto' }}>
                  {stats.map((s, i) => (
                    <div
                      key={s.libelle}
                      style={{
                        padding: '0 16px',
                        textAlign: 'center',
                        borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                      }}
                    >
                      <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.valeur}</p>
                      <p
                        style={{
                          fontSize: 9,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'rgba(255,255,255,0.5)',
                          marginTop: 6,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {s.libelle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section style={carte}>
              <div
                onClick={() => setOuvert((o) => !o)}
                style={{
                  cursor: 'pointer',
                  padding: '14px 20px',
                  borderBottom: ouvert ? '1px solid #f1f5f9' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      fontSize: 10,
                      color: '#1e3a8a',
                      display: 'inline-block',
                      transform: ouvert ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    ▶
                  </span>
                  <h2 style={{ fontSize: 12, fontWeight: 600, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Mes actions du trimestre
                  </h2>
                </div>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{actions.length} action(s)</span>
              </div>

              {ouvert && (
                <>
                  {actions.length === 0 ? (
                    <p style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                      Aucune action pour ce trimestre.
                    </p>
                  ) : (
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {actions.map((a) => {
                        const al = alerte(a);
                        const st = STATUTS[a.statut];
                        return (
                          <li
                            key={a.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 14,
                              padding: '12px 16px',
                              borderTop: '1px solid #f8fafc',
                            }}
                          >
                            <span
                              style={{ width: 4, height: 36, borderRadius: 9999, background: al.couleur, flexShrink: 0 }}
                              title={al.label}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 14, fontWeight: 500, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {a.nom}
                              </p>
                              {a.cadres_strategiques && (
                                <p style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {a.cadres_strategiques.nom} · {a.cadres_strategiques.domaine}
                                </p>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 140, flexShrink: 0 }}>
                              <div style={{ height: 6, flex: 1, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${a.pourcentage}%`, background: '#16305e', borderRadius: 9999 }} />
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', width: 34, textAlign: 'right' }}>
                                {a.pourcentage}%
                              </span>
                            </div>
                            <span
                              style={{
                                fontSize: 11,
                                padding: '2px 8px',
                                borderRadius: 9999,
                                background: st.fond,
                                color: st.texte,
                                flexShrink: 0,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {st.label}
                            </span>
                            <span style={{ fontSize: 11, color: '#94a3b8', width: 66, textAlign: 'right', flexShrink: 0 }}>
                              {new Date(a.echeance).toLocaleDateString('fr-FR')}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <div
                    style={{
                      padding: '12px 20px',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px 20px',
                    }}
                  >
                    {[
                      ['#10b981', 'Dans les temps'],
                      ['#facc15', 'Risque de retard'],
                      ['#fb923c', 'Retard probable'],
                      ['#dc2626', 'En retard'],
                    ].map(([c, l]) => (
                      <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#94a3b8' }}>
                        <span style={{ width: 8, height: 8, borderRadius: 9999, background: c }} />
                        {l}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </section>
          </>
        )}
      </main>

      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '16px 0' }}>
        <div style={{ maxWidth: 896, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/changer-code')}
            style={{ fontSize: 12, color: '#64748b', textDecoration: 'underline', textUnderlineOffset: 2, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Changer mon code
          </button>
        </div>
      </footer>
    </div>
  );
}
