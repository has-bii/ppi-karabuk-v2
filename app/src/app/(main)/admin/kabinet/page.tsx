import NewKabinet from "@/components/kabinet/new-kabinet"
import TableKabinet from "@/components/kabinet/table-kabinet"
import getAllKabinet from "@/queries/kabinet/getAllKabinet"

export const fetchCache = "force-cache"

export default async function Page() {
  const { data } = await getAllKabinet()

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
