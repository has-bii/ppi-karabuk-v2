import Division from "@/components/kabinet/division/division"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import createSupabaseServer, { createSupabaseServiceRole } from "@/lib/supabase/server"
import Link from "next/link"
import getKabinetById from "@/queries/kabinet/getKabinetById"
import KabinetEdit from "@/components/kabinet/edit-kabinet"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import AnggotaDivisi from "@/components/kabinet/division/anggota-divisi"
import getUsers from "@/queries/users/getUsers"

export const fetchCache = "force-cache"
export const dynamicParams = true
export const revalidate = 3600

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const supabase = createSupabaseServiceRole()
  const queryClient = new QueryClient()

  const { data } = await getKabinetById(supabase, id)

  await queryClient.prefetchQuery({
    queryKey: ["kabinet", id],
    queryFn: async () => {
      const { data, error } = await getKabinetById(supabase, id)

      if (error) throw new Error(error.message)

      return data
    },
    initialData: data,
  })

  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await getUsers()

      if (error) throw new Error(error.message)

      return data
    },
  })

  if (data)
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="space-y-4">
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

          {/* Edit */}
          <div className="flex w-full flex-col gap-8 lg:flex-row">
            <div className="space-y-4">
              <KabinetEdit dataProps={data} />
              <Division kabinetId={id} />
            </div>
            <AnggotaDivisi kabinetId={id} />
          </div>
        </div>
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
