import { Role } from "@prisma/client"

export default function getRoleStyle(role: Role): string {
  if (role === "ADMIN") return "blue"

  if (role === "USER") return "neutral"

  if (role === "STUDENT") return "green"

  return ""
}
