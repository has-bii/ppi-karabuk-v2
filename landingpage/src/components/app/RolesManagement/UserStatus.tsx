import { Size } from "@/types/style"
import getSize from "@/utils/style/getSize"

type Props = {
  isActive: boolean
  size: Size
}

export default function UserStatus({ isActive, size }: Props) {
  return (
    <div className={`pill ${isActive ? "green" : "red"} ${getSize(size, "pill")}`}>
      <span className={`h-1.5 w-1.5 rounded-full`}></span>
      <span>{isActive ? "active" : "inactive"}</span>
    </div>
  )
}
