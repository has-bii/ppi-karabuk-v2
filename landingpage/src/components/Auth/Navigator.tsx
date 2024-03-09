"use client"

import { useRouter } from "next/navigation"
import Logo from "../Logo"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"

export default function Navigator() {
  const router = useRouter()

  return (
    <section className="w-full flex flex-row justify-between container py-4">
      <Logo />
      <div className="inline-flex gap-2 items-center">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 border rounded-full border-neutral-500"
        >
          <FontAwesomeIcon icon={faAngleLeft} size="1x" />
        </button>
        <button
          onClick={() => router.forward()}
          className="w-8 h-8 border rounded-full border-neutral-500"
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
    </section>
  )
}
