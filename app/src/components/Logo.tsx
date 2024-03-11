import Image from "next/image"
import logo from "@/assets/logo.svg"

export default function Logo() {
  return (
    <div className="inline-flex items-center justify-start gap-2">
      <Image
        alt=""
        src={logo}
        width={42}
        sizes="10vw"
        quality={100}
        priority
        className="dark:invert"
        style={{
          height: "auto",
        }}
      />
      <span className="hidden text-2xl font-black text-foreground lg:block">PPI Karabuk</span>
    </div>
  )
}
