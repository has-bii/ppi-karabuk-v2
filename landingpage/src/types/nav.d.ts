import { Role } from "@prisma/client"

export type Nav = {
  id: number
  name: string
  role: Role | ""
  isActive: boolean
} & (
  | {
      type: "ITEM"
      url: string
    }
  | {
      type: "DROPDOWN"
      url: string
      navItems: {
        id: number
        name: string
        role: Role
        isActive: boolean
        type: "ITEM"
        url: string
      }[]
    }
)
