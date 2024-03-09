import updateImageProfile from "@/service/App/settings/profile/updateImageProfile"
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react"
import { useToast } from "@/context/ToastContext"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons"

type ChangingStateProps = {
  setLocation: Dispatch<SetStateAction<"MENU" | "CHANGE" | "REMOVE">>
}

export default function ChangingState({ setLocation }: ChangingStateProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { pushToast } = useToast()

  function isImageFile(file: File): boolean {
    const acceptedImageTypes = ["image/jpeg", "image/png", "image/jpg"]
    return acceptedImageTypes.includes(file.type)
  }

  function uploadFileHandler(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files === null) {
      setImageSrc(null)
      setFile(null)
      return undefined
    }

    if (e.target.files.length === 0) {
      setImageSrc(null)
      setFile(null)
      return undefined
    }

    const file = e.target.files[0]

    if (file.size > 2 * 1024 * 1024) {
      pushToast("Max size is 5MB", "danger")
      setFile(null)
      setImageSrc(null)
      return undefined
    }

    if (isImageFile(file)) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result instanceof ArrayBuffer) {
          const blob = new Blob([e.target.result], { type: file.type })
          const objectUrl = URL.createObjectURL(blob)
          setImageSrc(objectUrl)
        }
      }

      reader.readAsArrayBuffer(file)
      setFile(file)
    } else {
      pushToast("Invalid file type!", "danger")
      setFile(null)
      setImageSrc(null)
    }
  }

  function updateHandler(file: File) {
    setLoading(true)
    const formData = new FormData()

    formData.append("image", file)

    updateImageProfile(formData)
      .then((res) => {
        pushToast(res.message, res.status)
        setTimeout(() => location.reload(), 3000)
      })
      .catch((err) => {
        console.error(err)
        pushToast("Internal server error!", "error")
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Image */}

      {imageSrc !== null ? (
        <div className="relative overflow-hidden rounded-md aspect-square w-full bg-black">
          <Image
            src={imageSrc}
            className="object-cover"
            fill
            sizes="30vw"
            quality={100}
            priority
            alt=""
          />
        </div>
      ) : (
        <div className="w-full py-8 flex flex-col gap-2 justify-center items-center">
          <FontAwesomeIcon icon={faCloudArrowUp} size="4x" className="text-neutral-300" />
          <p className="text-neutral-300">File format: JPG / JPEG / PNG</p>
          <label
            htmlFor="file-image"
            className="px-4 py-2 rounded-md bg-sky-300 text-white mt-2 hover:cursor-pointer"
          >
            Choose File
          </label>
          <p className="text-neutral-300 text-sm">Max size: 2MB</p>
        </div>
      )}

      {/* Buttons */}
      <div className="inline-flex items-center gap-2 w-full">
        <input
          ref={inputRef}
          type="file"
          name="file-image"
          id="file-image"
          accept="image/jpg,image/jpeg,image/png"
          onChange={uploadFileHandler}
          className="hidden"
        />
        {file !== null ? (
          <button
            type="button"
            onClick={() => {
              updateHandler(file)
            }}
            disabled={loading}
            className="mt-2 w-full text-center capitalize rounded-md bg-sky-400 text-white font-medium px-3 py-1.5"
          >
            save
          </button>
        ) : (
          ""
        )}
        <button
          type="button"
          className="mt-2 w-full text-center capitalize rounded-md border text-sky-400 font-medium px-3 py-1.5"
          onClick={() => setLocation("MENU")}
        >
          back
        </button>
      </div>
    </div>
  )
}
