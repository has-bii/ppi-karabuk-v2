"use client"

import { Nav } from "@/types/nav"
import { Role } from "@prisma/client"
import { usePathname, useRouter } from "next/navigation"
import React, { Dispatch, SetStateAction } from "react"

type Props = {
  nav: Nav
} & {
  setShow: Dispatch<SetStateAction<boolean>>
  userRole: Role[]
}

export default function NavItem({ setShow, nav, userRole }: Props) {
  const pathName = usePathname()
  const router = useRouter()

  function checkPath(pathName: string, url: string | null): boolean {
    if (pathName.replace("/app", "").length === 0 && url?.length === 0) return true

    const path = pathName.replace("/app", "").split("/").slice(1)

    if (url) {
      if (path.length === 0 && url.length === 0) return true

      return url.includes(path.shift() as string)
    }
    return false
  }

  function openNewPath(url: string | null) {
    setShow(false)
    router.push("/app" + url)
  }

  if (!nav.isActive) return ""

  if (!userRole.includes(nav.role as Role) && nav.role.length !== 0) return ""

  if (nav.type === "ITEM")
    return (
      <button
        key={nav.id}
        className={`capitalize text-lg px-4 py-2 text-white lg:text-black font-bold 
        ${
          checkPath(pathName, nav.url)
            ? "bg-white/10 rounded-md lg:underline lg:underline-offset-[6px]"
            : "hover:bg-white/10 hover:rounded-md lg:hover:underline lg:hover:underline-offset-[6px]"
        }`}
        onClick={() => openNewPath(nav.url)}
      >
        {nav.name}
      </button>
    )

  if (nav.type === "DROPDOWN")
    return (
      <div key={nav.id} className="relative group">
        <button
          className={`capitalize text-lg px-4 py-2 text-white lg:text-black font-bold ${
            checkPath(pathName, nav.url)
              ? "bg-white/10 rounded-md lg:underline lg:underline-offset-[6px]"
              : "hover:bg-white/10 hover:rounded-md lg:hover:underline lg:hover:underline-offset-[6px]"
          }`}
        >
          {nav.name}
        </button>

        <div className="px-4 py-3 bg-white absolute left-1/2 -translate-x-1/2 top-10 border rounded z-40 drop-shadow-md hidden group-hover:block">
          {nav.navItems
            .filter((nav) => nav.isActive)
            .map((navItem) => (
              <button
                key={navItem.id}
                onClick={() => openNewPath(navItem.url)}
                className={`capitalize text-black
        ${
          checkPath(pathName, navItem.url)
            ? "bg-white/10 rounded-md font-semibold"
            : "hover:bg-white/10 hover:rounded-md lg:hover:font-semibold"
        }
        `}
              >
                {navItem.name}
              </button>
            ))}
        </div>
      </div>
    )
}
