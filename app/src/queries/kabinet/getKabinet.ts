import { TypedSupabaseClient } from "@/lib/supabase/types"

export default function getKabinet(client: TypedSupabaseClient) {
  return client.from("kabinet").select(`*`).throwOnError()
}
