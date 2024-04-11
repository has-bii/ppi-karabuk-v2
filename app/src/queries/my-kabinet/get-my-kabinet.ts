"use server"

import createSupabaseServer from "@/lib/supabase/server"
import { Database } from "@/types/database"
import { ResponseWithData } from "@/types/response"

type Data = {
  division_user_type: Database["public"]["Tables"]["division_user"]["Row"]["division_user_type"]
  kabinet: Database["public"]["Tables"]["kabinet"]["Row"] | null
  division: Database["public"]["Tables"]["division"]["Row"] | null
}[]

export default async function getMyKabinet(): Promise<ResponseWithData<Data>> {
  try {
    const supabase = createSupabaseServer()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { status: "error", message: "Unauthorized!" }

    const { data, error } = await supabase
      .from("division_user")
      .select("kabinet(*),division(*),division_user_type")
      .eq("user_id", user.id)

    if (error) return { status: "error", message: error.message }

    if (!data) return { status: "error", message: "Internal server error!" }

    return { status: "success", data, message: "" }
  } catch (error) {
    console.error("Failed to fetch my kabinet: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
