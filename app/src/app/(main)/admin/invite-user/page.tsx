import SignUpSettings from "@/components/invite-users/signup-settings"
import InviteUsers from "@/components/invite-users/invite-users"
import createSupabaseServer from "@/lib/supabase/server"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"

export const fetchCache = "default-cache"

export default async function Page() {
  const supabase = createSupabaseServer()
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["signup-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*")

      if (error) throw new Error(error.message)

      return data
    },
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Invite Users */}
        <InviteUsers />

        {/* Signup settings */}
        <SignUpSettings />
      </div>
    </HydrationBoundary>
  )
}
