import { Database } from "@/types/database"
import { RoleEnum } from "@/types/user"
import React, { useCallback } from "react"

type Props = {
  role: RoleEnum[]
}

export default function Role({ role }: Props) {
  const getStyle = useCallback((role: RoleEnum): string | undefined => {
    switch (role) {
      case "STUDENT":
        return "bg-green-100 text-green-400"

      case "SUPER_ADMIN":
        return "bg-red-100 text-red-400"

      default:
        break
    }
  }, [])

  if (role.length === 0) return <span>none</span>

  return role.map((value, index) => (
    <span key={index} className={`px-2 py-1 rounded-full ${getStyle(value)}`}>
      {value.replaceAll("_", " ").toLowerCase()}
    </span>
  ))
}
