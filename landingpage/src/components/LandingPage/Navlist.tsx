"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function Navlist() {
  const [showNav, setShowNav] = useState<boolean>(false)
  const pathName = usePathname()

  return (
    <div className="navlist-container">
      <button className="block lg:hidden text-black" onClick={() => setShowNav(true)}>
        <FontAwesomeIcon icon={faBars} size="xl" />
      </button>
      <ul className={`navlist ${showNav ? "active" : ""}`}>
        <li className="block lg:hidden text-white">
          <button onClick={() => setShowNav(false)}>
            <FontAwesomeIcon icon={faXmark} size="xl" />
          </button>
        </li>
        <li>
          <Link href="/" className={`nav-item ${pathName === "/" ? "active" : ""}`}>
            home
          </Link>
        </li>
        <li>
          <Link
            href="/article"
            className={`nav-item ${pathName.startsWith("/article") ? "active" : ""}`}
          >
            article
          </Link>
        </li>
        <li className="mt-auto mb-4 block lg:hidden">
          <Link href="/auth" className="button white">
            login
          </Link>
        </li>
      </ul>
    </div>
  )
}
