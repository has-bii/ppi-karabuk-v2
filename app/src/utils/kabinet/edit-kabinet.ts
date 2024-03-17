"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { ResponseWithData } from "@/types/response"
import getUserRole from "../getUserRole"
import { Database } from "@/types/database"
import { revalidatePath, revalidateTag } from "next/cache"

type Params = {
  id: string
  name?: string
  start_date?: string
  end_date?: string
}

type Kabinet = Database["public"]["Tables"]["kabinet"]["Row"]

export default async function editKabinet({
  id,
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
      .update({ name, end_date, start_date })
      .eq("id", id)
      .select(`*`)
      .single()

    if (error) {
      console.error("Failed to edited kabinet: ", error)
      return { status: "error", message: error.message }
    }

    revalidatePath(`/admin/kabinet/${id}`)

    return { status: "success", message: "Edited kabinet successfully", data }
  } catch (error) {
    console.error("Failed to edit kabinet: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
