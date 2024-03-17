"use client"

import useSupabaseBrowser from "@/lib/supabase/supabase-browser"
import Image from "next/image"
import dummypp from "@/assets/images/dummy-pp.png"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useUserProfileQuery from "@/hooks/user-profile/useUserProfileQuery"
import { getImageFromS3 } from "@/utils/S3"
import LogoutButton from "../auth/LogoutButton"

export default function User() {
  const { data: profile, isError } = useUserProfileQuery()

  if (isError || !profile) {
    return ""
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative aspect-square w-10 overflow-hidden rounded-full border">
        <Image
          alt=""
          src={profile.image ? getImageFromS3(profile.image, "profiles") : dummypp}
          fill
          className="object-cover"
          sizes="10vw"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogoutButton>Logout</LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
