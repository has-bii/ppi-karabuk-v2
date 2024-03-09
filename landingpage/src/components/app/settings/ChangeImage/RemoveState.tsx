"use client"

import removeProfileImage from "@/service/App/settings/profile/removeProfileImage"
import { Dispatch, SetStateAction, useState } from "react"
import { useToast } from "@/context/ToastContext"
import dummy from "@/images/dummy-pp.png"
import Image from "next/image"

type Props = {
  setLocation: Dispatch<SetStateAction<"MENU" | "CHANGE" | "REMOVE">>
}

export default function RemoveState({ setLocation }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const { pushToast } = useToast()

  function removeImageHandler() {
    setLoading(true)
    removeProfileImage()
      .then((res) => {
        pushToast(res.message, res.status)
        setInterval(() => location.reload(), 2000)
      })
      .catch((err) => {
        console.error(err)
        pushToast("Client side error!", "error")
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="flex flex-col items-center">
      {/* Image */}
      <div className="relative rounded-full overflow-hidden aspect-square w-48 bg-black mb-4 opacity-25">
        <Image
          src={dummy}
          className="object-cover"
          fill
          sizes="30vw"
          quality={100}
          priority
          alt=""
        />
      </div>

      <div className="text-center text-2xl font-semibold mb-0 text-neutral-400    ">
        Remove profile picture?
      </div>
      <div className="text-center text-neutral-300 mb-4">
        Your previous picture will be removed,
        <br /> and this image will be used instead.
      </div>
      <div className="inline-flex gap-2 items-center w-full">
        <button
          className="w-1/2 px-3 py-1.5 bg-white border rounded-md capitalize text-sky-400 font-medium"
          onClick={() => setLocation("MENU")}
        >
          cancel
        </button>
        <button
          className="w-1/2 px-3 py-1.5 bg-sky-400 border-sky-400 rounded-md capitalize text-white font-medium disabled:hover:cursor-not-allowed"
          onClick={() => removeImageHandler()}
          disabled={loading}
        >
          remove
        </button>
      </div>
    </div>
  )
}
