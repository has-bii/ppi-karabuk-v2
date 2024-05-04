"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { ResponseWithData } from "@/types/response"
import { revalidatePath } from "next/cache"
import getUserRole from "@/utils/getUserRole"
import { KabinetByID } from "@/queries/kabinet/getKabinetById"

type Params = {
  kabinet_id: string
  name: string
}

export default async function createDivision({
  kabinet_id,
  name,
}: Params): Promise<ResponseWithData<KabinetByID["division"][0]>> {
  try {
    const supabase = createSupabaseServiceRole()

    const role = await getUserRole()

    if (!role.includes("ADMIN")) return { status: "error", message: "Permission denied!" }

    const { error, data } = await supabase
      .from("division")
      .insert({ kabinet_id, name, type: "divisi" })
      .select(`*,division_user(*)`)
      .single()

    if (error) {
      console.error("Failed to create new division: ", error)
      return { status: "error", message: error.message }
    }

    revalidatePath(`/admin/kabinet/${kabinet_id}`)
    revalidatePath(`/bph/kabinet/${kabinet_id}`)

    return { status: "success", message: "Created new division successfully", data }
  } catch (error) {
    console.error("Failed to create new division: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
