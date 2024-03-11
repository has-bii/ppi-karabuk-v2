import Image from "next/image"
import logo from "@/assets/logo.svg"
import { ModeToggle } from "../ModeToggle"

export default function Topnav() {
  return (
    <div className="inline-flex justify-between items-center w-full">
      <div className="inline-flex gap-3 items-center">
        <div className="relative w-10 aspect-square overflow-hidden fill-white">
          <Image
            alt=""
            src={logo}
            fill
            sizes="20vw"
            priority
            className="object-contain dark:invert"
          />
        </div>
        <span className="text-foreground text-2xl font-black">PPI Karabuk</span>
      </div>
      <ModeToggle />
    </div>
  )
}
