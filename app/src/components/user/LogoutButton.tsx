"use client"

import createSupabaseClient from "@/lib/supabase/client"
import { SizeProp } from "@fortawesome/fontawesome-svg-core"
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"

type Props = {
  size: SizeProp
}

export function LogoutButton({ size }: Props) {
  const supabase = createSupabaseClient()
  const router = useRouter()

  return (
    <button
      onClick={() => {
        supabase.auth.signOut({ scope: "local" }).then(() => {
          router.refresh()
        })
      }}
    >
      <FontAwesomeIcon icon={faRightFromBracket} size={size} />
    </button>
  )
}
