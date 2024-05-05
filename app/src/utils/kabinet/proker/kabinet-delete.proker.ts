"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Response } from "@/types/response"
import { revalidatePath } from "next/cache"

type Params = {
  id: string
  name: string
  kabinet_id: string
}

export default async function kabinetProkerDelete(params: Params): Promise<Response> {
  try {
    const supabase = createSupabaseServiceRole()

    const { data, error } = await supabase
      .from("proker")
      .delete()
      .match({ id: params.id })
      .select("*")

    if (error) {
      console.error(`Failed to delete ${params.name}: `, error)
      return { status: "error", message: error.message }
    }

    revalidatePath(`/admin/kabinet/${params.kabinet_id}`)
    revalidatePath(`/bph/kabinet/${params.kabinet_id}`)

    return { status: "success", message: `Deleted ${params.name} successfully` }
  } catch (error) {
    console.error(`Failed to delete ${params.name}: `, error)
    return { status: "error", message: "Internal server error!" }
  }
}
