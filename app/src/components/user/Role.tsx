import { Role } from "@/types/enum"
import React, { useCallback } from "react"

type Props = {
  role: Role[] | undefined | null
}

export default function UserRole({ role }: Props) {
  const getStyle = useCallback((role: Role): string | undefined => {
    switch (role) {
      case "STUDENT":
        return "bg-green-100 text-green-400"

      case "ADMIN":
        return "bg-red-100 text-red-400"

      case "BPH":
        return "bg-blue-100 text-blue-400"

      default:
        break
    }
  }, [])

  if (!role || role.length === 0) return <span>none</span>

  return role.map((value, index) => (
    <span key={index} className={`rounded-full px-2 py-1 ${getStyle(value)}`}>
      {value}
    </span>
  ))
}
