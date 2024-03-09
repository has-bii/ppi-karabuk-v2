import Image from "next/image"
import logoppi from "@/assets/icon.png"
import logoppiwhite from "@/assets/logo_white.png"
import Link from "next/link"

type Props = {
  color?: "black" | "white"
  className?: string
}

export default function Logo({ color = "black", className = "" }: Props) {
  return (
    <Link href="/" className={`inline-flex gap-2 items-center ${className}`}>
      <Image
        src={color === "black" ? logoppi : logoppiwhite}
        width="50"
        height="50"
        alt="Logo PPI Karabuk"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
        quality={100}
        priority={true}
      />
      <div className="font-black text-xl uppercase leading-none text-left">
        <span className="block">PPI</span>
        <span className="block">Karabuk</span>
      </div>
    </Link>
  )
}
