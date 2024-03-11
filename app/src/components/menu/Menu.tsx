"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGear,
  faGraduationCap,
  faHome,
  faKey,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback } from "react"

export default function Menu() {
  const pathname = usePathname()

  const isActive = useCallback(
    (path: string) => {
      return (path !== "/" && pathname.startsWith(path)) || (path === "/" && pathname === path)
        ? "text-accent-foreground"
        : ""
    },
    [pathname]
  )

  return (
    <aside className="fixed bottom-0 left-0 w-full border-t bg-background text-foreground/50 lg:relative lg:w-fit lg:border-r lg:border-t-0">
      <ul className="flex flex-row items-center justify-between gap-2 p-4 lg:flex-col lg:gap-4">
        {/* Dashboard */}
        <li>
          <Link href="/">
            <FontAwesomeIcon
              icon={faHome}
              size="lg"
              className={`hover:text-accent-foreground ${isActive("/")}`}
            />
          </Link>
        </li>
        {/* Student */}
        <li>
          <Link href="/student">
            <FontAwesomeIcon
              icon={faGraduationCap}
              size="lg"
              className={`hover:text-accent-foreground ${isActive("/student")}`}
            />
          </Link>
        </li>
        {/* BPH */}
        <li>
          <Link href="/admin">
            <FontAwesomeIcon
              icon={faUserTie}
              size="lg"
              className={`hover:text-accent-foreground ${isActive("/admin")}`}
            />
          </Link>
        </li>
        {/* Super Admin */}
        <li>
          <Link href="/super-admin">
            <FontAwesomeIcon
              icon={faKey}
              size="lg"
              className={`hover:text-accent-foreground ${isActive("/super-admin")}`}
            />
          </Link>
        </li>
        {/* Settings */}
        <li>
          <Link href="/settings">
            <FontAwesomeIcon
              icon={faGear}
              size="lg"
              className={`hover:text-accent-foreground ${isActive("/settings")}`}
            />
          </Link>
        </li>
      </ul>
    </aside>
  )
}
