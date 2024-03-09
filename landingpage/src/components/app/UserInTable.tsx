import getFileServiceURL from "@/utils/getFileServiceURL"
import dummyPP from "@/images/dummy-pp.png"
import Image from "next/image"
import React from "react"

type Props = {
  user: { name: string; email: string; image: string | null }
}

export default function UserInTable({ user }: Props) {
  return (
    <div className="inline-flex gap-2 items-center w-fit">
      <div className="relative h-14 aspect-square overflow-hidden">
        <Image
          src={user.image ? getFileServiceURL(user.image) : dummyPP}
          alt=""
          fill
          quality={100}
          sizes="20vw"
          className="object-cover rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <span className="capitalize text-xl text-black font-semibold">{user.name}</span>
        <span className="text-gray-400">{user.email}</span>
      </div>
    </div>
  )
}
