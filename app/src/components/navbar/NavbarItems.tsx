"use client"

import { NavItems } from "@/types/nav"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useCallback } from "react"

type Props = {
  navItemsData: NavItems[]
}

export default function NavbarItems({ navItemsData }: Props) {
  const pathname = usePathname()

  const isActive = useCallback(
    (href: string): string => {
      return pathname.startsWith(href) ? "text-accent-foreground" : ""
    },
    [pathname]
  )

  return (
    <div className="inline-flex h-fit items-center gap-1 overflow-x-auto px-4 text-accent-foreground scrollbar-none">
      {navItemsData.map((item) => (
        <div key={item.name} className="relative pb-2 pt-1 capitalize">
          <Link href={item.href} className="rounded-md px-2 py-1 hover:bg-accent">
            {item.name}
          </Link>
          {isActive(item.href) && (
            <div className="absolute bottom-0 left-1/2 w-3/4 -translate-x-1/2 border-b-2 border-accent-foreground" />
          )}
        </div>
      ))}
    </div>
  )
}
