"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Response } from "@/types/response"
import { revalidatePath } from "next/cache"

type Params = {
  kabinetId: string
  status: boolean
}

export default async function KabinetChangeStatus({
  kabinetId,
  status,
}: Params): Promise<Response> {
  try {
    const supabase = createSupabaseServiceRole()

    const { error } = await supabase
      .from("kabinet")
      .update({ isShow: status })
      .match({ id: kabinetId })

    if (error) {
      console.error("Failed to change kabinet status: ", error.message)
      return { status: "error", message: error.message }
    }

    revalidatePath(`/admin/kabinet/${kabinetId}`)
    revalidatePath(`/bph/kabinet/${kabinetId}`)

    return { status: "success", message: "Kabinet status has been changed" }
  } catch (error) {
    console.error("Failed to change kabinet status: ", error)
    return { status: "error", message: "Internal server error" }
  }
}
