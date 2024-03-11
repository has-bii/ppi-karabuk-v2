"use client"

import React, { ChangeEvent, useCallback, useState } from "react"
import dummypp from "@/assets/images/dummy-pp.png"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCircleNotch,
  faImage,
  faPencil,
  faTrashCan,
  faUpload,
} from "@fortawesome/free-solid-svg-icons"
import { useToast } from "@/context/ToastContext"
import createSupabaseClient from "@/lib/supabase/client"
import generateFileName from "@/utils/generateFileName"
import { getImageFromS3 } from "@/utils/S3"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type Props = {
  image: string | null
}

export function ChangeImage({ image }: Props) {
  const [state, setState] = useState<"menu" | "change" | "remove">("menu")

  const changeToMenu = useCallback(() => {
    setState("menu")
  }, [])
  const changeToChange = useCallback(() => {
    setState("change")
  }, [])
  const changeToRemove = useCallback(() => {
    setState("remove")
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="inline-flex gap-2 items-center text-sky-400 justify-center w-full mt-2 font-semibold"
        >
          <FontAwesomeIcon icon={faImage} />

          <span>Change Image</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        {state === "menu" && (
          <MenuState
            changeToChange={changeToChange}
            changeToRemove={changeToRemove}
            image={image}
          />
        )}
        {state === "change" && <ChangeState changeToMenu={changeToMenu} />}
        {state === "remove" && <RemoveState changeToMenu={changeToMenu} />}
      </DialogContent>
    </Dialog>
  )
}

type MenuStateProps = {
  changeToChange: () => void
  changeToRemove: () => void
  image: Props["image"]
}

export function MenuState({ image, changeToChange, changeToRemove }: MenuStateProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Change Image</DialogTitle>
        <DialogDescription>You can change or remove your profile image.</DialogDescription>
      </DialogHeader>
      <div>
        <div className="relative w-full aspect-square rounded-md overflow-hidden bg-black">
          <Image
            alt=""
            src={image ? getImageFromS3(image, "profiles") : dummypp}
            fill
            sizes="33vw"
            quality={100}
            priority
            className="object-cover"
          />
        </div>
        <div className="inline-flex gap-2 items-center mt-4 w-full">
          <Button
            className="bg-foreground text-accent border font-semibold w-full"
            onClick={changeToChange}
          >
            Change
          </Button>
          <Button
            className="bg-foreground text-accent border font-semibold w-full inline-flex gap-2 items-center disabled:bg-accent-foreground"
            disabled={image === null}
            onClick={changeToRemove}
          >
            <FontAwesomeIcon icon={faTrashCan} />
            Remove
          </Button>
        </div>
      </div>
    </>
  )
}

type ChangeStateProps = {
  changeToMenu: () => void
}

export function ChangeState({ changeToMenu }: ChangeStateProps) {
  const [file, setFile] = useState<{ file: File; src: string } | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const supabase = createSupabaseClient()
  const { pushToast } = useToast()

  const uploadFileHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.item(0) === null || e.target.files === null) {
      return
    }

    const file = e.target.files.item(0) as File

    if (file.size > 2 * 1024 * 1024) {
      pushToast("Max size is 2MB", "danger")
      setFile(null)
      return
    }

    if (!["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type)) {
      pushToast("Invalid file type!", "danger")
      setFile(null)
      return
    }

    setFile({ file: file, src: URL.createObjectURL(file) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateHandler = async () => {
    const res = await supabase.from("user").select(`id,image`).single()

    if (res.error) return

    if (!file) return

    pushToast("Changing profile image...", "normal")
    setLoading(true)

    const { data, error } = await supabase.storage
      .from("profiles")
      .upload(`${res.data.id}/${generateFileName(file.file.name)}`, file.file)

    if (error) {
      pushToast(error.message, "error")
      setLoading(false)
      return
    }

    const updateRes = await supabase.from("user").update({ image: data.path }).eq("id", res.data.id)

    if (updateRes.error) {
      pushToast(updateRes.error.message, "error")
      setLoading(false)
      return
    }

    if (res.data.image) await supabase.storage.from("profiles").remove([res.data.image])

    setLoading(false)

    window.location.reload()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Changing Image</DialogTitle>
      </DialogHeader>
      <div>
        <div className="relative w-full flex justify-center items-center aspect-square rounded-md overflow-hidden">
          {file !== null ? (
            <Image
              alt=""
              src={file.src}
              fill
              sizes="33vw"
              quality={100}
              priority
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex flex-col justify-center items-center gap-1">
              <FontAwesomeIcon icon={faUpload} size="5x" className="text-default-200" />
              <span className="font-light text-sm mt-2">File format: JPG / JPEG / PNG</span>
              <div className="inline-flex text-foreground">
                <label className="underline hover:cursor-pointer font-semibold">
                  Click to upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={uploadFileHandler}
                    accept="image/png,image/jpg,image/jpeg"
                  />
                </label>
                &nbsp;profile image.
              </div>
              <span className="font-light text-sm">Max file size: 2 MB</span>
            </div>
          )}
        </div>
        <div className="inline-flex gap-2 items-center mt-4 w-full">
          {file !== null && (
            <Button
              className="bg-foreground text-accent border font-semibold w-full inline-flex gap-2 items-center disabled:bg-accent-foreground"
              onClick={updateHandler}
            >
              {loading && <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />}
              {loading ? "Uploading..." : "Save"}
            </Button>
          )}
          <Button
            className="bg-foreground text-accent border font-semibold w-full inline-flex gap-2 items-center disabled:bg-accent-foreground"
            onClick={changeToMenu}
          >
            Back
          </Button>
        </div>
      </div>
    </>
  )
}

export function RemoveState({ changeToMenu }: ChangeStateProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const supabase = createSupabaseClient()
  const { pushToast } = useToast()

  const removeImageHandler = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from("user").select(`id,image`).single()

    if (!data) {
      pushToast("Internal server error!", "error")
      setLoading(false)
      return
    }

    const updateRes = await supabase.from("user").update({ image: null }).eq("id", data.id)

    if (updateRes.error) {
      pushToast("Failed to remove image!", "error")
      setLoading(false)
      return
    }

    const { error } = await supabase.storage.from("profiles").remove([data.image!])

    if (error) {
      pushToast(error.message, "error")
      setLoading(false)
      return
    }

    pushToast("Profile image has been removed", "success")
    window.location.reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <DialogHeader>
        <DialogTitle>Remove Image</DialogTitle>
      </DialogHeader>
      <div>
        <div className="flex flex-col items-center">
          {/* Image */}
          <div className="relative rounded-full overflow-hidden aspect-square w-48 mb-4 opacity-25 dark:border-8 dark:border-white">
            <Image
              src={dummypp}
              className="object-cover"
              fill
              sizes="30vw"
              quality={100}
              priority
              alt=""
            />
          </div>

          <div className="text-center text-2xl font-semibold mb-0 text-foreground    ">
            Remove profile picture?
          </div>
          <div className="text-center text-muted-foreground mb-4">
            Your previous picture will be removed,
            <br /> and this image will be used instead.
          </div>
          <div className="inline-flex gap-2 items-center w-full mt-4">
            <Button
              className="bg-foreground text-accent border font-semibold w-full inline-flex gap-2 items-center disabled:bg-accent-foreground"
              onClick={changeToMenu}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-400 text-white border font-semibold w-full inline-flex gap-2 items-center"
              onClick={removeImageHandler}
              disabled={loading}
            >
              {loading && <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />}
              {loading ? "Removing..." : "Remove"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
