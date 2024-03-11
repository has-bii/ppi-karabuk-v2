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
  title: "Student | PPI Karabuk",
}

const navItems: NavItems[] = [
  {
    href: "/student",
    name: "Dashboard",
  },
  {
    href: "/student/musta",
    name: "Musta",
  },
]

export default async function StudentLayout({ children }: Props) {
  const supabase = createSupabaseServer()

  supabase
    .from("user")
    .select("role")
    .single()
    .then(({ data }) => {
      if (!data?.role.includes("STUDENT")) redirect("/")
    })

  return <Wrapper navItems={navItems}>{children}</Wrapper>
}
