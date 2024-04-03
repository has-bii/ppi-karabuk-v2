import getMyKabinet from "@/queries/my-kabinet/get-my-kabinet"
import { useQuery } from "@tanstack/react-query"

export default function useMyKabinetQuery() {
  const queryKey = ["mykabinet"]

  const queryFn = async () =>
    getMyKabinet()
      .then((res) => {
        if (res.status === "error") throw new Error(res.message)
        else return res.data
      })
      .catch((error) => {
        throw new Error(error)
      })

  return useQuery({ queryKey, queryFn })
}
