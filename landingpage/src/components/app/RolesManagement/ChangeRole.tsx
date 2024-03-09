import { faCircleNotch, faUserPen } from "@fortawesome/free-solid-svg-icons"
import changeRoles from "@/service/App/admin/Roles Management/changeRoles"
import { Dispatch, SetStateAction, useCallback, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useToast } from "@/context/ToastContext"
import { $Enums, Role } from "@prisma/client"
import { useFormStatus } from "react-dom"

type Props = {
  id: string
  role: Role[]
  setData: Dispatch<SetStateAction<Data[]>>
}

type Data = {
  id: string
  name: string
  email: string
  role: $Enums.Role[]
  isActive: boolean
  image: string | null
  createdAt: Date
}

export default function ChangeRole({ id, role, setData }: Props) {
  const [editRole, setEditRole] = useState<Role[]>(role)
  const { pushToast } = useToast()

  const checkRole = useCallback((role: Role[], check: Role) => {
    return role.includes(check)
  }, [])

  const changeHandler = useCallback((editRole: Role[], role: Role) => {
    if (editRole.includes(role)) setEditRole((prev) => prev.filter((item) => item !== role))
    else setEditRole((prev) => [...prev, role])
  }, [])

  async function submitHandler(formData: FormData) {
    try {
      const res = await changeRoles(formData)

      pushToast(res.message, res.status)

      if (res.status === "success")
        setData((prev) =>
          prev.map((item) => {
            if (item.id === id) item.role = editRole

            return item
          })
        )
    } catch (error) {
      pushToast("Internal server error!", "error")
    }
  }

  return (
    <div className="relative group w-fit">
      <div className="inline-flex gap-2 items-center px-3 py-1.5 rounded-lg bg-black text-white whitespace-nowrap">
        <span>Change Role</span>
        <FontAwesomeIcon icon={faUserPen} />
      </div>

      <div className="p-3 bg-white border border-black rounded-lg absolute top-1/2 -translate-y-1/2 right-0 hidden group-hover:block w-fit">
        <form action={submitHandler} className="flex flex-row gap-2 items-center justify-center">
          <input type="text" name="input-id" id="id" value={id} readOnly className="hidden" />
          <label className="block">
            <input
              type="checkbox"
              name="input-student"
              className="mr-1"
              checked={checkRole(editRole, "STUDENT")}
              onChange={() => changeHandler(editRole, "STUDENT")}
            />
            Student
          </label>
          <label className="block">
            <input
              type="checkbox"
              name="input-user"
              className="mr-1"
              checked={checkRole(editRole, "USER")}
              onChange={() => changeHandler(editRole, "USER")}
            />
            User
          </label>
          <label className="block">
            <input
              type="checkbox"
              name="input-admin"
              className="mr-1"
              checked={checkRole(editRole, "ADMIN")}
              onChange={() => changeHandler(editRole, "ADMIN")}
            />
            Admin
          </label>
          <SubmitButton />
        </form>
      </div>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className="bg-blue-400 px-3 py-1 text-sm rounded text-white w-full inline-flex gap-2 items-center justify-center"
      disabled={pending}
    >
      Apply
      {pending ? <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" /> : ""}
    </button>
  )
}
