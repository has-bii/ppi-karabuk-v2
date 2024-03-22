import DatabaseForm from "@/components/student/database/DatabaseForm"
import createSupabaseServer from "@/lib/supabase/server"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export default async function Page() {
  const queryClient = new QueryClient()
  const supabase = createSupabaseServer()

  await queryClient.prefetchQuery({
    queryKey: ["student-database"],
    queryFn: async () => (await supabase.from("student_database").select("*").single()).data,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DatabaseForm />
    </HydrationBoundary>
  )
}
