"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"

export type NavItemType = {
  name: string
  text: string
}

const items: NavItemType[] = [
  { name: "profile", text: "profile" },
  { name: "activate", text: "activate" },
  { name: "password", text: "change password" },
]

export default function NavSide() {
  const pathname = usePathname()
  const router = useRouter()
  return (
    <aside className="lg:w-fit w-full h-full">
      <ul className="pr-8 flex flex-row lg:flex-col gap-2 mb-4 overflow-x-auto scrollbar-none snap-x">
        {/* NavItem */}
        {items.map((item, index) => (
          <li key={index} className="snap-start w-fit lg:w-full">
            <div
              className={`capitalize w-full whitespace-nowrap rounded-md px-3 py-1.5 hover:cursor-pointer text-neutral-800 ${
                pathname.includes(item.name) ? "bg-neutral-100" : ""
              }`}
              onClick={() => router.push("/app/settings/" + item.name)}
            >
              {item.text}
            </div>
          </li>
        ))}
        {/* NavItem End */}
      </ul>
    </aside>
  )
}
