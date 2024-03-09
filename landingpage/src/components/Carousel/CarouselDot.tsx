import { DotsItem } from "react-alice-carousel"

export default function CarouselDot({ isActive }: DotsItem) {
  return (
    <div className={`w-4 h-4 mx-2 rounded-full ${isActive ? "bg-white" : "bg-black/50"}`}></div>
  )
}
