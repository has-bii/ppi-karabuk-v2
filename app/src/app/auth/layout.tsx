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
    <main className="w-screen flex flex-row h-dvh justify-center items-center bg-background">
      {/* <section className="min-w-full lg:min-w-[40rem] h-full flex flex-col justify-center items-center">
        <Topnav />
        {children}
      </section> */}

      <section className="min-w-full lg:min-w-[40rem] h-full flex flex-col justify-center items-center p-4 lg:p-24">
        <Topnav />
        <div className="my-auto">{children}</div>
      </section>

      <div className="flex-1 relative overflow-hidden h-full hidden lg:block">
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
