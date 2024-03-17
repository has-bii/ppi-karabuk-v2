import getUsers from "@/queries/users/getUsers"
import { useQuery } from "@tanstack/react-query"

export default function useUsersQuery() {
  const queryKey = ["users"]

  const queryFn = async () => {
    const { data, error } = await getUsers()

    if (error) throw new Error(error.message)

    return data
  }

  return useQuery({ queryKey, queryFn })
}
