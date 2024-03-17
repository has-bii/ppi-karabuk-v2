import Navbar from "@/components/navbar/Navbar"
import { Metadata } from "next"
import { navItems } from "./navitem"
import getUserRole from "@/utils/getUserRole"

type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: "Admin | PPI Karabuk",
}

export const fetchCache = "default-no-store"

export default async function SuperAdminLayout({ children }: Props) {
  const role = await getUserRole()

  return (
    <>
      <Navbar navItemsData={navItems} />
      <div className="p-4 pb-20 lg:p-8 lg:pb-8">
        {role.includes("ADMIN") ? (
          children
        ) : (
          <div className="h-full w-full">
            Anda tidak bisa mengakses halaman ini, karena anda bukan seorang admin.
          </div>
        )}
      </div>
    </>
  )
}
