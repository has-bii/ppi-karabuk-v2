"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Response } from "@/types/response"
import { revalidatePath } from "next/cache"

type Params = {
  kabinetId: string
  path: string
}

export default async function KabinetUploadImage({ path, kabinetId }: Params): Promise<Response> {
  try {
    const supabase = createSupabaseServiceRole()

    const { error } = await supabase
      .from("kabinet")
      .update({ image: path })
      .match({ id: kabinetId })

    if (error) {
      console.error("Failed to update kabinet image: ", error.message)
      return { status: "error", message: error.message }
    }

    revalidatePath(`/admin/kabinet/${kabinetId}`)
    revalidatePath(`/bph/kabinet/${kabinetId}`)

    return { status: "success", message: "Cover has been updated" }
  } catch (error) {
    console.error("Failed to update kabinet image: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
