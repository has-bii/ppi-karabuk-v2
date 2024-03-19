import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { getSignupSettings } from "@/utils/signup-settings/fetch-signup-settings"
import { revalidatePath, revalidateTag } from "next/cache"

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServiceRole()
    const { signup_default_role: roles, signup_is_enabled: isEnabled } =
      await getSignupSettings(supabase)

    if (!isEnabled)
      return Response.json({
        status: "error",
        message: "You cannot sign up right now. Please contact the admin!",
      })

    const res = await request.json()

    const { name, email, password } = res

    const {
      error,
      data: { user },
    } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
      options: { data: { name: name.toLowerCase() } },
    })

    if (error) return Response.json({ status: "error", message: error.message })

    revalidatePath("/admin/manage-user")
    revalidatePath("/(main)/admin/kabinet/[id]", "page")
    revalidateTag("all-users")

    const { error: error1 } = await supabase
      .from("user_role")
      .update({ role: roles })
      .eq("user_id", user?.id!)

    if (error1) return Response.json({ status: "error", message: error1.message })

    return Response.json({
      status: "success",
      message: "Signed up successfully. Please check your email!",
    })
  } catch (error) {
    console.log("Failed to sign up: ", error)
    return Response.json({
      status: "error",
      message: "Internal server error!",
    })
  }
}
