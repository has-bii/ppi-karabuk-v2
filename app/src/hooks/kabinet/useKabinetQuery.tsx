import useSupabaseClient from "@/lib/supabase/supabase-browser"
import getKabinet from "@/queries/kabinet/getKabinet"
import { Database } from "@/types/database"
import { useQuery } from "@tanstack/react-query"

type Kabinet = Database["public"]["Tables"]["kabinet"]["Row"][]

export default function useKabinetQuery(initialData?: Kabinet) {
  const supabase = useSupabaseClient()
  const queryKey = ["kabinet"]

  const queryFn = async () => {
    const { data, error } = await getKabinet(supabase)

    if (error) throw new Error(error.message)

    return data
  }

  return useQuery({ queryKey, queryFn, initialData })
}
