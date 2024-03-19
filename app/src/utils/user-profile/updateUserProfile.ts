"use server"

import createSupabaseServer from "@/lib/supabase/server"
import { Response } from "@/types/response"
import { revalidateTag } from "next/cache"

type Profile = {
  name: string
  image: string | null
}

export async function updateUserProfile(id: string, params: Partial<Profile>): Promise<Response> {
  try {
    const supabase = createSupabaseServer()

    const { error } = await supabase
      .from("profiles")
      .update({ ...params })
      .match({ id })

    if (error) return { status: "error", message: error.message }

    revalidateTag("all-users")
    revalidateTag("all-profiles")

    return { status: "success", message: `Changed ${Object.keys(params)[0]} successfully` }
  } catch (error) {
    return { status: "error", message: "Internal server error" }
  }
}
