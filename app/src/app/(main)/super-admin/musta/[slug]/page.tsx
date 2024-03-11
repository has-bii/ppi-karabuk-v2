import MustaById from "@/components/super-admin/musta-id/MustaById"
import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

async function fetchData(params: string) {
  const supabase = createSupabaseServiceRole()

  const { data, error } = await supabase
    .from("musta")
    .select(`*,musta_file(*),musta_vote(*)`)
    .eq("id", params)
    .single()

  if (error) console.error("Failed to fetch musta data by id: ", error)

  return data
}

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await fetchData(params.slug)

  if (!data) 
    redirect("/super-admin/musta")
  

  return <MustaById dataProps={data} />
}
