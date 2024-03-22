import Menu from "@/components/menu/Menu"
import createSupabaseServer from "@/lib/supabase/server"
import { getUserProfile } from "@/queries/user-profile/getUserProfile"
import { Profile } from "@/types/model"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { Metadata } from "next"
import React from "react"

type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: "Dashboard | PPI Karabuk",
}

export default async function MainLayout({ children }: Props) {
  const queryClient = new QueryClient()
  const supabase = createSupabaseServer()

  await queryClient.prefetchQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const {
        data: { user },
        error: error1,
      } = await supabase.auth.getUser()

      if (error1) throw new Error(error1.message)

      const { data, error: error2 } = await getUserProfile(supabase)

      if (error2) throw new Error(error2.message)

      return { ...data, email: user?.email as string } as Profile
    },
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex h-dvh flex-col md:flex-row-reverse">
        {/* Main */}
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
        {/* Sidebar | Bottom bar */}
        <Menu />
      </main>
    </HydrationBoundary>
  )
}
