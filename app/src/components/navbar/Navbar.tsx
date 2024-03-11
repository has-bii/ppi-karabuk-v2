"use client"

import { NavItems } from "@/types/nav"
import Logo from "../Logo"
import { ModeToggle } from "../ModeToggle"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback } from "react"

type Props = {
  navItemsData?: NavItems[]
}

export default function Navbar({ navItemsData }: Props) {
  const pathname = usePathname()

  const isActive = useCallback(
    (href: string): string => {
      return (href !== "/" && pathname.startsWith(href)) || (href === "/" && pathname === href)
        ? "text-accent-foreground"
        : ""
    },
    [pathname]
  )

  return (
    <nav className="flex h-fit flex-col border-b">
      <div className="inline-flex w-full justify-between px-4 py-4">
        <Logo />
        <ModeToggle />
      </div>
      {navItemsData && (
        <div className="scrollbar-none inline-flex items-center gap-1 overflow-x-auto px-4 text-accent-foreground">
          {navItemsData.map((item) => (
            <div key={item.name} className="relative pb-2 capitalize">
              <Link href={item.href} className="rounded-md px-2 py-1 hover:bg-accent">
                {item.name}
              </Link>
              {isActive(item.href) && (
                <div className="absolute bottom-0 left-1/2 w-3/4 -translate-x-1/2 border-b-2 border-accent-foreground" />
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}
