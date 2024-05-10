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
      id: Database["public"]["Tables"]["division"]["Row"]["id"]
      name: Database["public"]["Tables"]["division"]["Row"]["name"]
      type: Database["public"]["Tables"]["division"]["Row"]["type"]
    } | null
    profiles: {
      id: Database["public"]["Tables"]["profiles"]["Row"]["id"]
      name: Database["public"]["Tables"]["profiles"]["Row"]["name"]
      image: Database["public"]["Tables"]["profiles"]["Row"]["image"]
    } | null
  })[]
} & {
  proker: (Database["public"]["Tables"]["proker"]["Row"] & {
    profiles: {
      id: Database["public"]["Tables"]["profiles"]["Row"]["id"]
      name: Database["public"]["Tables"]["profiles"]["Row"]["name"]
      image: Database["public"]["Tables"]["profiles"]["Row"]["image"]
    } | null
    division: {
      id: Database["public"]["Tables"]["division"]["Row"]["id"]
      name: Database["public"]["Tables"]["division"]["Row"]["name"]
      type: Database["public"]["Tables"]["division"]["Row"]["type"]
    } | null
  })[]
}

export type UserPosition = KabinetByID["division_user"][0]

const getKabinetById = async (id: string) => {
  return createSupabaseServiceRole()
    .from("kabinet")
    .select(
      `*,
      division_user(
        *,
        division(
          id,
          name,
          type
        ),
        profiles(
          id,
          name,
          image
        )
      ),
      division(
        *,
        division_user(
          *
        )
      ),
      proker(
        *,
        profiles(
          id,
          name,
          image
        ),
        division(
          id,
          name,
          type
        )
      )`
    )
    .eq("id", id)
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
          id,
          name,
          type
        ),
        profiles(
          id,
          name,
          image
        )
      ),
      division(
        *,
        division_user(
          *
        )
      ),
      proker(
        *,
        profiles(
          id,
          name,
          image
        ),
        division(
          id,
          name,
          type
        )
      )`
    )
    .eq("id", id)
    .throwOnError()
    .single()
}

export { getKabinetByIdUncached, getKabinetById }
