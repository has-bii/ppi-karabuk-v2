"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { TypedSupabaseClient } from "@/lib/supabase/types"
import { unstable_cache } from "next/cache"

const getAllKabinet = unstable_cache(
  async () => createSupabaseServiceRole().from("kabinet").select("*").throwOnError(),
  ["all-kabinet"],
  { tags: ["all-kabinet"] }
)

export default getAllKabinet
