"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Response } from "@/types/response"
import { revalidatePath } from "next/cache"

type Params = {
  id: string
  name: string
  divisionName: string
}

export default async function deleteAnggotaDivisi({
  id,
  divisionName,
  name,
}: Params): Promise<Response> {
  try {
    const supabase = createSupabaseServiceRole()

    const { error, data } = await supabase
      .from("division_user")
      .delete()
      .match({ id })
      .select("kabinet_id")
      .single()

    if (error) {
      console.error(`Failed to remove ${name} from ${divisionName}: `, error)
      return { status: "error", message: `Failed to remove ${name} from ${divisionName}` }
    }

    revalidatePath(`/admin/kabinet/${data.kabinet_id}`)

    return { status: "success", message: `Removed ${name} from ${divisionName}` }
  } catch (error) {
    console.error("Failed to delete anggota from a division: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
