"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { UserRole } from "@/types/model"
import { Response } from "@/types/response"
import { revalidateTag } from "next/cache"
import getUserRole from "../getUserRole"

type Params = {
  user_id: string
  role: UserRole
}

export default async function changeUserRole({ user_id, role }: Params): Promise<Response> {
  try {
    const supabase = createSupabaseServiceRole()

    const userRole = await getUserRole()

    if (!userRole.includes("ADMIN")) return { status: "error", message: "Permission denided" }

    const { error } = await supabase
      .from("user_role")
      .update({ role: role })
      .match({ user_id })
      .throwOnError()

    if (error) {
      console.error("Failed to change user role: ", error.message)
      return { status: "error", message: error.message }
    }

    revalidateTag("all-users")

    return { status: "success", message: "User role has been changed" }
  } catch (error) {
    console.error("Failed to change user role: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
