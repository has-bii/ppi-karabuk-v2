"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"

export default async function getUsers() {
  const supabase = createSupabaseServiceRole()

  return supabase.from("profiles").select("name,id").throwOnError()
}
