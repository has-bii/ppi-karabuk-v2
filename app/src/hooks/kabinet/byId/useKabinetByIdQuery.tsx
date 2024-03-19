import { getKabinetById, getKabinetByIdUncached } from "@/queries/kabinet/getKabinetById"
import { useQuery } from "@tanstack/react-query"

export default function useKabinetByIdQuery(id: string) {
  const queryKey = ["kabinet", id]

  const queryFn = async () => (await getKabinetByIdUncached(id)).data

  return useQuery({ queryKey, queryFn })
}
