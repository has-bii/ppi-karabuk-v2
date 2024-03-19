import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Profile } from "@/types/model"
import { unstable_cache } from "next/cache"

type Response =
  | {
      data: Profile[]
      error: null
    }
  | {
      data: null
      error: string
    }

const getAllUsers = unstable_cache(
  async (): Promise<Response> => {
    const supabase = createSupabaseServiceRole()

    const {
      data: { users },
      error: errorUser,
    } = await supabase.auth.admin.listUsers()

    if (errorUser) {
      console.error("Failed to fetch All users: ", errorUser.message)
      return { data: null, error: errorUser.message }
    }

    const { data, error } = await supabase.from("profiles").select(`*,user_role(role)`)

    if (error) {
      console.error("Failed to fetch All users: ", error.message)
      return { data: null, error: error.message }
    }

    const mapped = data.map((item) => {
      return { ...item, email: users.find((user) => user.id === item.id)?.email as string }
    })

    return { data: mapped as Profile[], error: null }
  },
  ["all-users"],
  { tags: ["all-users"], revalidate: 3600 }
)

export default getAllUsers
