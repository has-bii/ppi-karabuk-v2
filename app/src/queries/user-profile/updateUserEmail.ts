import { TypedSupabaseClient } from "@/lib/supabase/types"

export async function updateUserEmail(client: TypedSupabaseClient, email: string) {
  return client.auth.updateUser({ email }).then((result) => result.data)
}
