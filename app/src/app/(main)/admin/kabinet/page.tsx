import NewKabinet from "@/components/kabinet/new-kabinet"
import TableKabinet from "@/components/kabinet/table-kabinet"
import createSupabaseServer from "@/lib/supabase/server"
import getKabinet from "@/queries/kabinet/getKabinet"

export default async function Page() {
  const supabase = createSupabaseServer()

  const { data } = await getKabinet(supabase)

  if (data)
    return (
      <div className="flex flex-col-reverse gap-8 lg:flex-row">
        <div className="flex-1">
          <TableKabinet path="/admin" initialData={data} />
        </div>
        <NewKabinet />
      </div>
    )
}
