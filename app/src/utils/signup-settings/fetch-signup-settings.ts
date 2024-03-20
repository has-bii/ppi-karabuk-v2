import { TypedSupabaseClient } from "@/lib/supabase/types"
import { Role } from "@/types/enum"
import { unstable_cache } from "next/cache"

const getSignupSettings = unstable_cache(
  async (supabase: TypedSupabaseClient) => {
    const { data } = await supabase.from("settings").select("*")

    if (!data)
      return {
        signup_default_role: null,
        signup_is_enabled: null,
      }

    const signup_default_role =
      (data.find((item) => item.setting === "signup_default_role")?.value as { array: Role[] })
        ?.array || []

    const signup_is_enabled =
      (data.find((item) => item.setting === "signup_is_enabled")?.value as { boolean: boolean })
        ?.boolean || null

    const signup_default_status =
      (data.find((item) => item.setting === "signup_default_status")?.value as { boolean: boolean })
        ?.boolean || false

    return { signup_default_role, signup_is_enabled, signup_default_status }
  },
  ["signup-settings"]
)

export { getSignupSettings }
