import createSupabaseClient from "@/lib/supabase/client"
import { Database } from "@/types/database"

export type UserProfile = Database["public"]["Tables"]["user"]["Row"]

export default async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase.from("user").select(`*`).single()

  if (error) {
    console.error("Failed to fetch User Profile: ", error.message)
    return null
  }

  return data
}
