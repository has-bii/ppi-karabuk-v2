import Wrapper from "@/components/Wrapper"
import createSupabaseServer from "@/lib/supabase/server"
import { NavItems } from "@/types/nav"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import React from "react"

type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: "Super Admin | PPI Karabuk",
}

const navItems: NavItems[] = [
  {
    href: "/super-admin",
    name: "DASHBOARD",
  },
  {
    href: "/super-admin/invite-user",
    name: "INVITE USERS",
  },
  {
    href: "/super-admin/musta",
    name: "MUSTA",
  },
]

export default async function SuperAdminLayout({ children }: Props) {
  const supabase = createSupabaseServer()

  supabase
    .from("user")
    .select("role")
    .single()
    .then(({ data }) => {
      if (!data?.role.includes("SUPER_ADMIN")) redirect("/")
    })

  return <Wrapper navItems={navItems}>{children}</Wrapper>
}
