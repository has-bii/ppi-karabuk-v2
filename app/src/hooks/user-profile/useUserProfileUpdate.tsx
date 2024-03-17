import { updateUserProfile } from "@/queries/user-profile/updateUserProfile"
import useSupabaseClient from "@/lib/supabase/supabase-browser"
import { useMutation } from "@tanstack/react-query"
import { Profile } from "@/types/model"

export default function useUserProfileUpdate() {
  const client = useSupabaseClient()

  const mutationFn = async (data: Partial<Profile>) => {
    const { data: updatedData, error } = await updateUserProfile(client, { data })

    if (error) throw new Error(error.message)

    return { ...updatedData, email: data.email }
  }

  return useMutation({
    mutationFn,
  })
}
