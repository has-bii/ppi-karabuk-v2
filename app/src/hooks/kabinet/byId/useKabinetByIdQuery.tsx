import { getKabinetByIdUncached, KabinetByID } from "@/queries/kabinet/getKabinetById"
import { useQuery } from "@tanstack/react-query"

export default function useKabinetByIdQuery(id: string, initialData?: KabinetByID) {
  const queryKey = ["kabinet", id]

  const queryFn = async () => {
    const { data, error } = await getKabinetByIdUncached(id)

    if (error) throw new Error(error.message)

    return data
  }

  return useQuery({ queryKey, queryFn, initialData })
}
