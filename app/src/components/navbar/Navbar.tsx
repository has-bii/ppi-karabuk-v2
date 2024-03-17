import { NavItems } from "@/types/nav"
import Logo from "../Logo"
import { ModeToggle } from "../ModeToggle"
import NavbarItems from "./NavbarItems"

import User from "./User"

type Props = {
  navItemsData?: NavItems[]
}

export default function Navbar({ navItemsData }: Props) {
  return (
    <nav className="flex flex-col border-b">
      <div className="inline-flex w-full items-center gap-4 px-4 py-4">
        <div className="mr-auto">
          <Logo />
        </div>
        <ModeToggle />
        <User />
      </div>

      {/* Nav Items */}
      {navItemsData && <NavbarItems navItemsData={navItemsData} />}
    </nav>
  )
}
