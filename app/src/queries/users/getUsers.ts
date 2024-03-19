"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { unstable_cache } from "next/cache"

const getUsers = unstable_cache(
  async () => {
    const supabase = createSupabaseServiceRole()

    return supabase.from("profiles").select("name,id").throwOnError()
  },
  ["all-profiles"],
  { revalidate: 3600 }
)

export default getUsers
