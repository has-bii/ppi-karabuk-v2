"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Response } from "@/types/response"
import { revalidatePath } from "next/cache"
import getUserRole from "@/utils/getUserRole"

type Params = {
  kabinet_id: string
  division_id: string
}

export default async function deleteDivision({
  kabinet_id,
  division_id,
}: Params): Promise<Response> {
  try {
    const supabase = createSupabaseServiceRole()

    const role = await getUserRole()

    if (!role.includes("ADMIN")) return { status: "error", message: "Permission denied!" }

    const { error, data } = await supabase.from("division").delete().match({ id: division_id })

    if (error) {
      console.error("Failed to delete division: ", error)
      return { status: "error", message: error.message }
    }

    revalidatePath(`/admin/kabinet/${kabinet_id}`)

    return { status: "success", message: "Deleted division successfully" }
  } catch (error) {
    console.error("Failed to deleted division: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
