import { Size } from "@/types/style"
import getRoleStyle from "@/utils/style/getRoleStyle"
import getSize from "@/utils/style/getSize"
import { Role } from "@prisma/client"

type Props = {
  role: Role[]
  size: Size
}

export default function UserRole({ role, size }: Props) {
  return (
    <div className={`inline-flex gap-1 items-center`}>
      {role.map((item, index) => (
        <div key={index} className={`badge ${getSize(size, "badge")} ${getRoleStyle(item)}`}>
          {item.toLowerCase()}
        </div>
      ))}
    </div>
  )
}
