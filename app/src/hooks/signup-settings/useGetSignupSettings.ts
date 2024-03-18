import createSupabaseClient from "@/lib/supabase/client"
import { TypedSupabaseClient } from "@/lib/supabase/types"
import { Database } from "@/types/database"
import { useQuery } from "@tanstack/react-query"

type SignupSettings = Database["public"]["Tables"]["settings"]["Row"][]

export default function useGetSignUpSettings(supabase?: TypedSupabaseClient) {
  let client = supabase || createSupabaseClient()
  const queryKey = ["signup-settings"]

  const queryFn = async () => {
    const { data, error } = await client.from("settings").select("*")

    if (error) throw new Error(error.message)

    return data
  }

  return useQuery({ queryKey, queryFn })
}
