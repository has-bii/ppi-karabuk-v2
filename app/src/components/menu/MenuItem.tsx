"use client"

import { faGraduationCap, faHome, faKey, faUserTie } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useCallback } from "react"

export default function MenuItem() {
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
    <>
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
    </>
  )
}
