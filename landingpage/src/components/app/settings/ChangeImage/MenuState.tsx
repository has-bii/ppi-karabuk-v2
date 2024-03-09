import { faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { Dispatch, SetStateAction } from "react"
import dummy from "@/images/dummy-pp.png"
import Image from "next/image"
import getFileServiceURL from "@/utils/getFileServiceURL"

type MenuStateType = {
  userImage: string | null
  setLocation: Dispatch<SetStateAction<"MENU" | "CHANGE" | "REMOVE">>
}

export default function MenuState({ userImage, setLocation }: MenuStateType) {
  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Image */}
      <div className="relative overflow-hidden rounded-md aspect-square w-full bg-black">
        <Image
          src={userImage ? getFileServiceURL(userImage) : dummy}
          fill
          sizes="30vw"
          className="object-cover"
          quality={100}
          priority
          alt=""
        />
      </div>

      {/* Buttons */}
      <div className="inline-flex items-center gap-4 w-full">
        <button
          type="button"
          className="px-3 py-1.5 inline-flex gap-2 items-center rounded-md capitalize border text-sky-400 w-full justify-center font-semibold"
          onClick={() => setLocation("CHANGE")}
        >
          <FontAwesomeIcon icon={faPencil} />
          change
        </button>
        <button
          type="button"
          className="px-3 py-1.5 inline-flex gap-2 items-center rounded-md capitalize border text-sky-400 w-full justify-center font-semibold disabled:text-slate-400 disabled:hover:cursor-not-allowed"
          disabled={userImage === null}
          onClick={() => setLocation("REMOVE")}
        >
          <FontAwesomeIcon icon={faTrashCan} />
          remove
        </button>
      </div>
    </div>
  )
}
