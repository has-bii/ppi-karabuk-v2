"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Role } from "@/types/enum"
import { Response } from "@/types/response"
import getUserRole from "../getUserRole"
import { revalidatePath, revalidateTag } from "next/cache"

type Params = {
  signup_default_role: Role[]
  signup_is_enabled: boolean
}

export default async function saveSettings({
  signup_default_role,
  signup_is_enabled,
}: Params): Promise<Response> {
  try {
    const supabase = createSupabaseServiceRole()

    const role = await getUserRole()

    if (!role.includes("ADMIN")) return { status: "error", message: "Permission denied!" }

    const { error } = await supabase
      .from("settings")
      .update({ setting: "signup_default_role", value: { array: signup_default_role } })
      .eq("setting", "signup_default_role")

    if (error) return { status: "error", message: error.message }

    const { error: error1 } = await supabase
      .from("settings")
      .update({ setting: "signup_is_enabled", value: { boolean: signup_is_enabled } })
      .eq("setting", "signup_is_enabled")

    if (error1) return { status: "error", message: error1.message }

    revalidatePath("/admin/invite-user")
    revalidateTag("signup-settings")

    return { status: "success", message: "New settings have been saved" }
  } catch (error) {
    console.error("Failed to save settings: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
