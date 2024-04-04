import Division from "@/components/kabinet/division/division"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { getKabinetById } from "@/queries/kabinet/getKabinetById"
import KabinetEdit from "@/components/kabinet/edit-kabinet"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import AnggotaDivisi from "@/components/kabinet/division/anggota-divisi"
import { getProfilesCached } from "@/queries/profile/getProfilesCached"
import { redirect } from "next/navigation"
import createSupabaseServer from "@/lib/supabase/server"
import KabinetImage from "@/components/kabinet/image-kabinet"

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

  const { data } = await getKabinetById(kabinet_id)
  if (!data) redirect("/bph/kabinet")

  // Find user position
  const userPosition = data.division_user.find((check) => check.user_id === user?.id)

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

  const { division } = userPosition

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-4">
        <KabinetImage id={data.id} disableChange={division?.type !== "ketua"} />

        <div className="inline-flex justify-between">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin">Admin</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/kabinet">Kabinet</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">{data.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Edit */}
        <div className="flex w-full flex-col gap-8 lg:flex-row">
          <Division
            kabinetId={kabinet_id}
            disableEdit={division?.type !== "ketua" && division?.type !== "sekretaris"}
          />
          <AnggotaDivisi
            kabinetId={kabinet_id}
            position={division!}
            disableEdit={
              division?.type !== "MPA" &&
              division?.type !== "ketua" &&
              division?.type !== "sekretaris"
            }
          />
        </div>
      </div>
    </HydrationBoundary>
  )
}
