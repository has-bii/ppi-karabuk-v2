import Navbar from "@/components/navbar/Navbar"
import { Metadata } from "next"
import { navItems } from "./navitem"

type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: "BPH | PPI Karabuk",
}

export const fetchCache = "default-no-store"

export default async function BPHLayout({ children }: Props) {
  return (
    <>
      <Navbar navItemsData={navItems} />
      <div className="p-4 pb-20 lg:p-8 lg:pb-8">{children}</div>
    </>
  )
}
