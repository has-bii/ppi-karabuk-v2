import ManageUsers from "@/components/manage-users/manage-users"
import getAllUsers from "@/utils/manage-users/getAllUsers"

export const fetchCache = "force-cache"

export default async function Page() {
  const data = await getAllUsers()

  if (data.error || !data.data) return <div>{data.error}</div>

  return <ManageUsers dataProp={data.data} />
}
