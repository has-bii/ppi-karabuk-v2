"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { ResponseWithData } from "@/types/response"
import getUserRole from "../getUserRole"
import { Database } from "@/types/database"
import { revalidatePath } from "next/cache"

type Params = {
  name: string
  start_date: string
  end_date: string
}

type Kabinet = Database["public"]["Tables"]["kabinet"]["Row"]

export default async function createKabinet({
  end_date,
  name,
  start_date,
}: Params): Promise<ResponseWithData<Kabinet>> {
  try {
    const supabase = createSupabaseServiceRole()

    const role = await getUserRole()

    if (!role.includes("ADMIN")) return { status: "error", message: "Permission denied!" }

    const { error, data } = await supabase
      .from("kabinet")
      .insert({ name, end_date, start_date })
      .select(`*`)
      .single()

    if (error) {
      console.error("Failed to create new kabinet: ", error)
      return { status: "error", message: error.message }
    }

    revalidatePath(`/admin/kabinet/${data.id}`)

    return { status: "success", message: "Created new kabinet successfully", data }
  } catch (error) {
    console.error("Failed to create new kabinet: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
