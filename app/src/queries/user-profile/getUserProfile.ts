import { TypedSupabaseClient } from "@/lib/supabase/types"

export function getUserProfile(client: TypedSupabaseClient) {
  return client.from("profiles").select(`*,user_role(role)`).throwOnError().single()
}
