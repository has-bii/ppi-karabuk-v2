"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Role } from "@/types/enum"
import { Response } from "@/types/response"
import { revalidatePath, revalidateTag } from "next/cache"

type InvitesUsersInputs = {
  name: string
  email: string
  roles: Role[]
}

export async function actionInvitesUsers({
  email,
  roles,
  name,
}: InvitesUsersInputs): Promise<Response> {
  try {
    const supabase = createSupabaseServiceRole()

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, { data: { name } })

    if (error) return { status: "error", message: error.message }

    const { error: error1 } = await supabase
      .from("user_role")
      .update({ role: roles })
      .eq("user_id", data.user.id)

    if (error1) return { status: "error", message: error1.message }

    const { error: error2 } = await supabase
      .from("profiles")
      .update({ isActive: true })
      .eq("id", data.user.id)

    if (error2) return { status: "error", message: error2.message }

    revalidateTag("all-profiles")
    revalidateTag("all-users")

    return { status: "success", message: "User has been invited" }
  } catch (error) {
    console.error("Failed to invite user: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
