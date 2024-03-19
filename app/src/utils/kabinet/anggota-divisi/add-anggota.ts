"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { KabinetByID } from "@/queries/kabinet/getKabinetById"
import { Database } from "@/types/database"
import { DivisionUserType } from "@/types/enum"
import { ResponseWithData } from "@/types/response"
import { revalidatePath } from "next/cache"

type Params = {
  user_id: string
  division_id: string
  division_user_type: DivisionUserType
  kabinet_id: string
}

type Data = KabinetByID["division_user"][0]

export default async function anggotaDivisiAdd({
  division_id,
  division_user_type,
  user_id,
  kabinet_id,
}: Params): Promise<ResponseWithData<Data>> {
  try {
    const supabase = createSupabaseServiceRole()

    const { error, data } = await supabase
      .from("division_user")
      .insert({ division_id, user_id, division_user_type, kabinet_id })
      .select("*,division(name,type),profiles(name,image)")
      .single()

    if (error) {
      console.error(`Failed to add user to the division: `, error)
      return { status: "error", message: "Failed to add a user to a division!" }
    }

    revalidatePath(`/admin/kabinet/${data.kabinet_id}`)

    return { status: "success", message: "Added a user to a division!", data }
  } catch (error) {
    console.error("Failed to add user to the division!: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
