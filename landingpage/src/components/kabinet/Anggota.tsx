import dummypp from "@/images/dummy-pp.png"
import Image from "next/image"

type Props = {
  image: string | null
  name: string | null
  position: "ketua" | "anggota" | string
}

export default function Anggota({ image, name, position }: Props) {
  return (
    <div className="flex flex-col min-w-[240px] w-72 snap-start border-2 border-black">
      {/* Ketua */}
      <div className="w-full aspect-square overflow-hidden relative z-10 border-b-2 border-black">
        <Image
          alt={name || ""}
          src={image || dummypp}
          fill
          sizes="33vw"
          quality={100}
          priority
          className="object-cover"
        />
      </div>
      <div className="p-2">
        <span className="text-neutral-400 capitalize block text-sm">{position}</span>
        <div className="line-clamp-1 text-base lg:text-xl font-semibold capitalize block whitespace-nowrap">
          {name}
        </div>
      </div>
    </div>
  )
}
