export interface Kabinet {
  id: string
  name: string
  start_date: string
  end_date: string
  created_at: string
  division: Division[]
}

interface Division {
  id: string
  name: string
  type: "MPA" | "ketua" | "sekretaris" | "bendahara" | "divisi"
  created_at: string
  kabinet_id: string
  division_user: Divisionuser[]
}

interface Divisionuser {
  id: string
  user_id: string
  profiles: Profiles
  created_at: string
  kabinet_id: string
  division_id: string
  division_user_type: "anggota" | "ketua"
}

interface Profiles {
  name: string
  image: string | null
}
