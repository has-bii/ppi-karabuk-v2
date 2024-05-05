"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Database } from "@/types/database"
import { ResponseWithData } from "@/types/response"
import { revalidatePath } from "next/cache"

type Params = {
  id: string
  status: "requesting" | "approved" | "rejected"
  name: string
}

type Data = Database["public"]["Tables"]["proker"]["Row"]

export default async function kabinetProkerStatusChange(
  params: Params
): Promise<ResponseWithData<Data>> {
  try {
    const supabase = createSupabaseServiceRole()

    const { data, error } = await supabase
      .from("proker")
      .update({ ...params })
      .match({ id: params.id })
      .select("*")
      .single()

    if (error) {
      console.error(`Failed to update ${params.name} status: `, error)
      return { status: "error", message: error.message }
    }

    revalidatePath(`/admin/kabinet/${data.kabinet_id}`)
    revalidatePath(`/bph/kabinet/${data.kabinet_id}`)

    return { status: "success", message: `Updated ${params.name} status successfully`, data }
  } catch (error) {
    console.error(`Failed to update ${params.name} status: `, error)
    return { status: "error", message: "Internal server error!" }
  }
}
