import Link from "next/link"
import Logo from "../Logo"
import Navlist from "./Navlist"

export default function Nav() {
  return (
    <nav className="nav-container">
      <div className="nav">
        <Logo />

        <Navlist />

        <Link href="https://app.ppi-karabuk.com/" className="button hidden lg:block">
          login
        </Link>
      </div>
    </nav>
  )
}
