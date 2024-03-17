import { Metadata } from "next"
import Image from "next/image"
import React from "react"
import authimage from "@/assets/images/auth-image.jpg"
import Topnav from "@/components/auth/top-nav"

type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: "Auth | PPI Karabuk",
}

export default function AuthLayout({ children }: Props) {
  return (
    <main className="flex h-dvh w-screen flex-row items-center justify-center bg-background">
      <section className="flex h-full min-w-full flex-col items-center justify-center p-4 lg:min-w-[40rem] lg:p-24">
        <Topnav />
        <div className="my-auto">{children}</div>
      </section>

      <div className="relative hidden h-full flex-1 overflow-hidden lg:block">
        <Image
          alt=""
          src={authimage}
          fill
          sizes="70vw"
          quality={100}
          priority
          className="object-cover"
        />
      </div>
    </main>
  )
}
