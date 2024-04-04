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
import KabinetImage from "@/components/kabinet/image-kabinet"
import KabinetSettings from "@/components/kabinet/settings-kabinet"
import Kabinet from "@/components/kabinet/kabinet"

export const fetchCache = "force-cache"
export const dynamicParams = true
export const revalidate = 3600

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const queryClient = new QueryClient()

  const { data } = await getKabinetById(id)

  if (!data) redirect("/admin/kabinet")

  await queryClient.prefetchQuery({
    queryKey: ["kabinet", id],
    queryFn: async () => {
      const { data, error } = await getKabinetById(id)

      if (error) throw new Error(error.message)

      return data
    },
    initialData: data,
  })

  await queryClient.prefetchQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => (await getProfilesCached()).data,
  })

  if (data)
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Kabinet id={id} path="/admin" />
      </HydrationBoundary>
    )

  return (
    <div className="space-y-4">
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
            <BreadcrumbPage className="font-semibold">Not found</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h4 className="heading-4">Kabinet not found.</h4>
    </div>
  )
}
