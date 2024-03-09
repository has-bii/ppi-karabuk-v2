import { Role } from "@prisma/client"

type UserProps = {
  id: string
  name: string
  email: string
  role: Role[]
  image: string | null
}

export { UserProps }
