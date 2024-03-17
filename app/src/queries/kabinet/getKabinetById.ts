import { TypedSupabaseClient } from "@/lib/supabase/types"
import { Database } from "@/types/database"
import { PostgrestBuilder } from "@supabase/postgrest-js"

export type KabinetByID = Database["public"]["Tables"]["kabinet"]["Row"] & {
  division: (Database["public"]["Tables"]["division"]["Row"] & {
    division_user: Database["public"]["Tables"]["division_user"]["Row"][]
  })[]
} & {
  division_user: (Database["public"]["Tables"]["division_user"]["Row"] & {
    division: {
      name: Database["public"]["Tables"]["division"]["Row"]["name"]
      type: Database["public"]["Tables"]["division"]["Row"]["type"]
    } | null
    profiles: {
      name: Database["public"]["Tables"]["profiles"]["Row"]["name"]
      image: Database["public"]["Tables"]["profiles"]["Row"]["image"]
    } | null
  })[]
}

export default function getKabinetById(
  supabase: TypedSupabaseClient,
  id: string
): PostgrestBuilder<KabinetByID> {
  return supabase
    .from("kabinet")
    .select(
      `*,
      division_user(
        *,
        division(
          name,
          type
        ),
        profiles(
          name,
          image
        )
      ),
      division(
        *,
        division_user(
          *
        )
      )`
    )
    .eq("id", id)
    .throwOnError()
    .single()
}
