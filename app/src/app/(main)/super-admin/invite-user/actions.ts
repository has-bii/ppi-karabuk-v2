"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Response } from "@/types/response"
import { RoleEnum } from "@/types/user"

type InvitesUsersInputs = {
  email: string
  roles: RoleEnum[]
}

export async function actionInvitesUsers({ email, roles }: InvitesUsersInputs): Promise<Response> {
  try {
    const supabase = createSupabaseServiceRole()

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email)

    if (error) return { status: "error", message: error.message }

    await supabase.from("user").update({ role: roles }).eq("id", data.user.id)

    return { status: "success", message: "User has been invited" }
  } catch (error) {
    console.error("Failed to invite user: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
