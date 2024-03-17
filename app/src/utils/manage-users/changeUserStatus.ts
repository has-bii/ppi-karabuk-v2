"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Response } from "@/types/response"
import { revalidateTag } from "next/cache"
import getUserRole from "../getUserRole"

type Params = {
  user_id: string
  status: boolean
}

export default async function changeUserStatus({ user_id, status }: Params): Promise<Response> {
  try {
    const supabase = createSupabaseServiceRole()

    const userRole = await getUserRole()

    if (!userRole.includes("ADMIN")) return { status: "error", message: "Permission denided" }

    const { error } = await supabase
      .from("profiles")
      .update({ isActive: status })
      .match({ id: user_id })
      .throwOnError()

    if (error) {
      console.error("Failed to change user status: ", error.message)
      return { status: "error", message: error.message }
    }

    revalidateTag("all-users")

    return { status: "success", message: "User status has been changed" }
  } catch (error) {
    console.error("Failed to change user status: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
