import { getKabinetById, KabinetByID, UserPosition } from "@/queries/kabinet/getKabinetById"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { getProfilesCached } from "@/queries/profile/getProfilesCached"
import { redirect } from "next/navigation"
import createSupabaseServer from "@/lib/supabase/server"
import Kabinet from "@/components/kabinet/kabinet"

export const fetchCache = "force-cache"
export const dynamicParams = true
export const revalidate = 3600

type Props = {
  params: { kabinet_id: string }
}

export default async function Page({ params: { kabinet_id } }: Props) {
  const queryClient = new QueryClient()
  const supabase = createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // fetch kabinet data
  const { data } = await getKabinetById(kabinet_id)
  if (!data) redirect("/bph/kabinet")

  // Find user position
  const userPosition: UserPosition | undefined = data.division_user.find(
    (check) => check.user_id === user?.id
  )

  if (!userPosition) redirect("/bph/kabinet")

  // Kabinet by id data
  await queryClient.prefetchQuery({
    queryKey: ["kabinet", kabinet_id],
    queryFn: async () => {
      const { data, error } = await getKabinetById(kabinet_id)

      if (error) throw new Error(error.message)

      return data
    },
    initialData: data,
  })

  // All profiles
  await queryClient.prefetchQuery({
    queryKey: ["all-profiles"],
    queryFn: async () =>
      getProfilesCached()
        .then((res) => res.data)
        .catch((error) => {
          throw new Error(error)
        }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Kabinet
        id={kabinet_id}
        path="/bph"
        disableChangeImage={userPosition.division?.type !== "ketua"}
        disableEditKabinet={userPosition.division?.type !== "ketua"}
        disableEditDivision={
          userPosition.division?.type !== "ketua" && userPosition.division?.type !== "sekretaris"
        }
        disableEditAnggota={
          userPosition.division_user_type === "anggota"
            ? true
            : userPosition.division?.type !== "MPA" &&
              userPosition.division?.type !== "ketua" &&
              userPosition.division?.type !== "sekretaris"
        }
        userPosition={userPosition}
      />
    </HydrationBoundary>
  )
}
