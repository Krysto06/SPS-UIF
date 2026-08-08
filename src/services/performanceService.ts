import { supabase } from '../lib/supabaseClient'

export interface ActionLigne {
  id: string
  nom: string
  trimestre: string
  echeance: string
  pourcentage: number
  statut: 'en_attente' | 'en_cours' | 'termine' | 'bloque'
  cadres_strategiques: { nom: string; domaine: string } | null
}

export function trimestreActuel(): string {
  const now = new Date()
  const q = Math.floor(now.getMonth() / 3) + 1
  return `T${q}-${now.getFullYear()}`
}

export async function actionsDuTrimestre(
  userId: string,
  trimestre: string,
): Promise<ActionLigne[]> {
  const { data, error } = await supabase
    .from('actions')
    .select('id, nom, trimestre, echeance, pourcentage, statut, cadres_strategiques(nom, domaine)')
    .eq('user_id', userId)
    .eq('trimestre', trimestre)
    .order('echeance', { ascending: true })
  if (error) throw error
  return (data ?? []) as unknown as ActionLigne[]
}

export function calculerScore(actions: { pourcentage: number }[]): number {
  if (actions.length === 0) return 0
  const somme = actions.reduce((t, a) => t + a.pourcentage, 0)
  return Math.round(somme / actions.length)
}

export async function performanceTrimestre(userId: string, trimestre: string) {
  const { data, error } = await supabase
    .from('performances')
    .select('*')
    .eq('user_id', userId)
    .eq('trimestre', trimestre)
    .maybeSingle()
  if (error) throw error
  return data
}
