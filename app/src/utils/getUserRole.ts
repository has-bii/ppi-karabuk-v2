import createSupabaseServer from "@/lib/supabase/server"

export default async function getUserRole() {
  const supabase = createSupabaseServer()

  const { data, error } = await supabase.from("user_role").select(`role`).single()

  if (error) return []

  return data.role || []
}
