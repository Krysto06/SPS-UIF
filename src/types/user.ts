export type Role = 'cadre' | 'directrice' | 'admin'

export interface Profil {
  id: string
  username: string
  nom: string
  prenom: string
  role: Role
  titre: string | null
  doit_changer_code: boolean
  created_at: string
}
