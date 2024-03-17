import useSupabaseClient from "@/lib/supabase/supabase-browser"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import React, { ReactNode, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

type Props = {
  children: ReactNode
}

export default function LogoutButton({ children }: Props) {
  const supabase = useSupabaseClient()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { toast } = useToast()

  const logoutHandler = useCallback(async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" })

    if (error) {
      toast({ variant: "destructive", description: error.message })
      return
    }

    queryClient.removeQueries({ queryKey: ["user-profile"], exact: true, type: "all" })
    router.refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <button onClick={logoutHandler}>{children}</button>
}
