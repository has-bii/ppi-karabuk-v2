import { getProfiles } from "@/queries/profile/getProfilesCached"
import { useQuery } from "@tanstack/react-query"

export default function useUsersQuery() {
  const queryKey = ["all-profiles"]

  const queryFn = async () => (await getProfiles()).data

  return useQuery({ queryKey, queryFn })
}
