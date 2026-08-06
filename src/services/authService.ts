import { supabase } from '../lib/supabaseClient'

function usernameToEmail(username: string): string {
  return `${username.trim().toLowerCase()}@sps-uif.local`
}

export async function seConnecter(username: string, code: string) {
  const email = usernameToEmail(username)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: code })
  if (error) throw error
  return data
}

export async function seDeconnecter() {
  await supabase.auth.signOut()
}

export async function recupererProfil(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function changerCode(nouveauCode: string) {
  const { error } = await supabase.auth.updateUser({ password: nouveauCode })
  if (error) throw error

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('users').update({ doit_changer_code: false }).eq('id', user.id)
  }
}
