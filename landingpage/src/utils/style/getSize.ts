import { Size } from "@/types/style"

export default function getSize(size: Size, component?: string): string {
  return `${component ? component + "-" : ""}${size}`
}
