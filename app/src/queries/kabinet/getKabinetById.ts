"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Database } from "@/types/database"
import { revalidatePath } from "next/cache"

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

const getKabinetById = async (id: string) => {
  return createSupabaseServiceRole()
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

const getKabinetByIdUncached = async (id: string) => {
  revalidatePath("/admin/kabinet/" + id, "page")

  return createSupabaseServiceRole()
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

export { getKabinetByIdUncached, getKabinetById }
