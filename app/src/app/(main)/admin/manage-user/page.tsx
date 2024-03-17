import ManageUsers from "@/components/manage-users/manage-users"
import fetch from "@/utils/manage-users/fetch"

export const fetchCache = "force-cache"

export default async function Page() {
  const data = await fetch()

  if (data.error || !data.data) return <div>{data.error}</div>

  return <ManageUsers dataProp={data.data} />
}
