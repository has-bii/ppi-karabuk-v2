import React from "react"
import { NavItems } from "@/types/nav"

type Props = {
  children: React.ReactNode
  navItems: NavItems[]
}

export default function Wrapper({ children, navItems }: Props) {
  return (
    <div className="overflow-y-auto pt-4">
      <div className="flex flex-row gap-2 border-b pb-2">
        {navItems.map((item) => (
          <div
            key={item.name}
            className="rounded-lg bg-accent px-3 py-1 capitalize text-accent-foreground"
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="my-4 overflow-y-auto overflow-x-hidden px-4 lg:px-0">{children}</div>
    </div>
  )
}
