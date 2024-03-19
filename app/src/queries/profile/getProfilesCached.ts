"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { revalidateTag, unstable_cache } from "next/cache"

const getProfiles = async function name() {
  const supabase = createSupabaseServiceRole()

  revalidateTag("all-profiles")

  return supabase.from("profiles").select("name,id").throwOnError()
}

const getProfilesCached = unstable_cache(
  async () => {
    const supabase = createSupabaseServiceRole()

    return supabase.from("profiles").select("name,id").throwOnError()
  },
  ["all-profiles"],
  { tags: ["all-profiles"] }
)

export { getProfiles, getProfilesCached }
