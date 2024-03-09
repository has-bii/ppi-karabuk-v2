"use client"

import { usePathname, useRouter } from "next/navigation"
import React, { ReactNode, useEffect } from "react"

type Props = {
  children: ReactNode
  url: string
  navSideItems: NavSideItems[]
}

export type NavSideItems = {
  url: string
  text: string
}

export default function PageWrapper({ children, navSideItems, url }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (window.screen.width < 1024) {
      const activeNavSide = document.getElementById("nav-side-active")
      activeNavSide?.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return (
    <div className="w-full h-full flex z-0 scrollbar-thin">
      <div className="container md:my-8 lg:my-14 bg-white p-8 md:rounded-xl border md:drop-shadow z-0 scrollbar-thin">
        <section className="flex flex-col lg:flex-row h-fit lg:h-full static scrollbar-thin">
          <aside className="lg:w-fit w-full h-full">
            <ul className="pr-8 flex flex-row lg:flex-col gap-2 mb-4 overflow-x-auto scrollbar-none snap-x">
              {/* NavItem */}
              {navSideItems.map((item, index) => (
                <li
                  key={index}
                  className={`w-fit lg:w-full ${
                    index === 0
                      ? "snap-start"
                      : index === navSideItems.length - 1
                      ? "snap-end"
                      : "snap-center"
                  }`}
                >
                  <div
                    id={pathname.includes(item.url) ? "nav-side-active" : undefined}
                    className={`capitalize w-full whitespace-nowrap rounded-md px-3 py-1.5 hover:cursor-pointer text-neutral-800 ${
                      pathname.includes(item.url) ? "bg-neutral-100" : ""
                    }`}
                    onClick={() => router.push("/app" + url + item.url)}
                  >
                    {item.text}
                  </div>
                </li>
              ))}
              {/* NavItem End */}
            </ul>
          </aside>
          <div className="app-page scrollbar-thin">{children}</div>
        </section>
      </div>
    </div>
  )
}
