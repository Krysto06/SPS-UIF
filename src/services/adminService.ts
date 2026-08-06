import { supabase } from '../lib/supabaseClient'
import type { Profil } from '../types/user'

export async function creerUtilisateur(input: {
  username: string
  nom: string
  prenom: string
  role: string
  titre: string
  code: string
}) {
  const { data, error } = await supabase.functions.invoke('creer-utilisateur', {
    body: input,
  })
  if (error) {
    let message = error.message
    try {
      const corps = await (error as unknown as { context: Response }).context.json()
      if (corps?.error) message = corps.error
    } catch {
      // pas de corps JSON, on garde le message par défaut
    }
    throw new Error(message)
  }
  if (data?.error) throw new Error(data.error)
  return data
}

export async function listerUtilisateurs(): Promise<Profil[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Profil[]
}
