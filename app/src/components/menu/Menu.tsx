"use client"

import {
  faGear,
  faGraduationCap,
  faHome,
  faKey,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback } from "react"

export default function Menu() {
  const pathname = usePathname()

  const isActive = useCallback(
    (path: string): string => {
      return (path !== "/" && pathname.startsWith(path)) || (path === "/" && pathname === path)
        ? "text-accent-foreground"
        : ""
    },
    [pathname]
  )

  return (
    <aside className="fixed bottom-0 left-0 w-full border-t bg-background/50 text-foreground/50 backdrop-blur-md md:relative md:w-fit md:border-r md:border-t-0">
      <ul className="flex flex-row items-center justify-between gap-2 p-4 md:h-full md:flex-col md:justify-start md:gap-6">
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
          <Link href="/student/database">
            <FontAwesomeIcon
              icon={faGraduationCap}
              size="lg"
              className={`hover:text-accent-foreground ${isActive("/student")}`}
            />
          </Link>
        </li>
        {/* BPH */}
        <li>
          <Link href="/bph/kabinet">
            <FontAwesomeIcon
              icon={faUserTie}
              size="lg"
              className={`hover:text-accent-foreground ${isActive("/bph")}`}
            />
          </Link>
        </li>
        {/* Super Admin */}
        <li>
          <Link href="/admin/manage-user">
            <FontAwesomeIcon
              icon={faKey}
              size="lg"
              className={`hover:text-accent-foreground ${isActive("/admin")}`}
            />
          </Link>
        </li>
        {/* Setting */}
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
