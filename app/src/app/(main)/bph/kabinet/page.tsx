import MyKabinet from "@/components/bph/my-kabinet"
import getMyKabinet from "@/queries/my-kabinet/get-my-kabinet"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export default async function Page() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["mykabinet"],
    queryFn: async () =>
      getMyKabinet()
        .then((res) => {
          if (res.status === "error") throw new Error(res.message)
          else return res.data
        })
        .catch((error) => {
          throw new Error(error)
        }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyKabinet />
    </HydrationBoundary>
  )
}
