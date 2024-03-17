import { TypedSupabaseClient } from "@/lib/supabase/types"
import { Profile } from "@/types/model"

export async function updateUserProfile(
  client: TypedSupabaseClient,
  params: {
    data: Partial<Profile>
  }
) {
  return client
    .from("profiles")
    .update({
      name: params.data.name,
      image: params.data.image,
    })
    .eq("id", params.data.id!)
    .throwOnError()
    .select("*,user_role(role)")
    .throwOnError()
    .single()
}
