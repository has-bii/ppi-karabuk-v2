"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Response } from "@/types/response"
import { revalidatePath, revalidateTag } from "next/cache"
import getUserRole from "../getUserRole"

type Params = {
  id: string
  name: string
}

export default async function deleteUser({ id, name }: Params): Promise<Response> {
  try {
    const supabase = createSupabaseServiceRole()

    const role = await getUserRole()

    if (!role.includes("ADMIN")) return { status: "error", message: "Permission denied!" }

    const { error } = await supabase.auth.admin.deleteUser(id)

    if (error) return { status: "error", message: error.message }

    revalidatePath("/(main)/admin/kabinet/[id]", "page")
    revalidateTag("all-users")
    revalidateTag("all-profiles")

    return { status: "success", message: `${name} has been deleted successfully` }
  } catch (error) {
    return { status: "error", message: "Internal server error!" }
  }
}
