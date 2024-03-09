export type UserSession = {
  id: string
  name: string
  isActive: boolean
  role: Role[]
  image: string | null
}
