"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Database } from "@/types/database"
import { ResponseWithData } from "@/types/response"
import { revalidatePath } from "next/cache"

type Proker = Database["public"]["Tables"]["proker"]["Row"]

type NullableProker = Omit<Proker, "id" | "created_at"> & {
  id?: string
  created_at?: string
}

export default async function kabinetProkerAdd(
  params: NullableProker
): Promise<ResponseWithData<Proker>> {
  try {
    const supabase = createSupabaseServiceRole()

    const { data, error } = await supabase
      .from("proker")
      .insert({ ...params })
      .select("*")
      .single()

    if (error) {
      console.error("Failed to create new Proker: ", error)
      return { status: "error", message: error.message }
    }

    revalidatePath(`/admin/kabinet/${params.kabinet_id}`)
    revalidatePath(`/bph/kabinet/${params.kabinet_id}`)

    return { status: "success", message: "Created new Proker successfully", data }
  } catch (error) {
    console.error("Failed to create new Proker: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
