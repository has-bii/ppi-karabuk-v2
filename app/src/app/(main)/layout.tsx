import Menu from "@/components/menu/Menu"
import { Metadata } from "next"
import React from "react"

type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: "Dashboard | PPI Karabuk",
}

export default async function MainLayout({ children }: Props) {
  return (
    <main className="flex h-dvh flex-col md:flex-row-reverse">
      {/* Main */}
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
      {/* Sidebar | Bottom bar */}
      <Menu />
    </main>
  )
}
