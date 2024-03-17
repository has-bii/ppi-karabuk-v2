import useSupabaseClient from "@/lib/supabase/supabase-browser"
import { getUserProfile } from "@/queries/user-profile/getUserProfile"
import { Profile } from "@/types/model"
import { useQuery } from "@tanstack/react-query"

export default function useUserProfileQuery() {
  const supabase = useSupabaseClient()
  const queryKey = ["user-profile"]

  const queryFn = async () => {
    const {
      data: { user },
      error: error1,
    } = await supabase.auth.getUser()

    if (error1) throw new Error(error1.message)

    const { data, error: error2 } = await getUserProfile(supabase)

    if (error2) throw new Error(error2.message)

    return { ...data, email: user?.email as string } as Profile
  }

  return useQuery({ queryKey, queryFn })
}
