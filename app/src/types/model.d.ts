import { Database } from "./database"

export type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  user_role: {
    role: UserRole | null
  }
  email: string
}

export type UserRole = Database["public"]["Enums"]["Role"][]
