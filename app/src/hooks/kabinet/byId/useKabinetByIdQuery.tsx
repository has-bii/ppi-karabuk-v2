import { TypedSupabaseClient } from "@/lib/supabase/types"
import getKabinetById from "@/queries/kabinet/getKabinetById"
import { useQuery } from "@tanstack/react-query"

export default function useKabinetByIdQuery(supabase: TypedSupabaseClient, id: string) {
  const queryKey = ["kabinet", id]

  const queryFn = async () => {
    const { data, error } = await getKabinetById(supabase, id)

    if (error) throw new Error(error.message)

    return data
  }

  return useQuery({ queryKey, queryFn })
}
