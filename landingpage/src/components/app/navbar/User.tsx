"use client"

import Image from "next/image"
import dummy from "@/images/dummy-pp.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useRef, useState } from "react"
import { useToast } from "@/context/ToastContext"
import { useRouter } from "next/navigation"
import getFileServiceURL from "@/utils/getFileServiceURL"
import { logout } from "@/service/auth/auth"
import { UserSession } from "@/types/session"

export default function User({ user }: { user: UserSession }) {
  const [show, setShow] = useState<boolean>(false)
  const { pushToast } = useToast()
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  async function _logout() {
    pushToast("Logging out...", "normal")

    logout().then(() => router.push("/auth"))
  }

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // Clicked outside the dropdown, so close it
        setShow(false)
      }
    }

    document.addEventListener("click", handleOutsideClick)

    return () => {
      document.removeEventListener("click", handleOutsideClick)
    }
  }, [ref])

  return (
    <div ref={ref} className="ml-auto inline-flex gap-2 items-center relative ">
      <div className="capitalize font-semibold text-xl hidden md:block">
        {user.name.split(" ").slice(0, 2).join(" ")}
      </div>
      <div
        className="h-10 w-10 relative rounded-full overflow-hidden hover:cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <Image
          src={user.image ? getFileServiceURL(user.image) : dummy}
          alt=""
          fill
          sizes="10vw"
          className="object-cover"
        />
      </div>
      {show && (
        <ul className="absolute top-12 right-0 w-fit h-fit bg-white rounded-md border border-black divide-y divide-black overflow-hidden">
          <li>
            <button
              className="w-full inline-flex gap-2 items-center px-4 py-2 hover:bg-black hover:text-white"
              onClick={() => {
                router.push("/app/settings")
                setShow(false)
              }}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Settings</span>
            </button>
          </li>
          <li>
            <button
              className="w-full inline-flex gap-2 items-center px-4 py-2 hover:bg-black hover:text-white"
              onClick={() => _logout()}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
