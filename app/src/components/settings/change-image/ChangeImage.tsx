"use client"

import React, { ChangeEvent, useCallback, useState } from "react"
import dummypp from "@/assets/images/dummy-pp.png"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch, faImage, faTrashCan, faUpload } from "@fortawesome/free-solid-svg-icons"
import createSupabaseClient from "@/lib/supabase/client"
import generateFileName from "@/utils/generateFileName"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Profile } from "@/types/model"
import useUserProfileUpdate from "@/hooks/user-profile/useUserProfileUpdate"
import { getImageFromS3 } from "@/utils/S3"
import { useQueryClient } from "@tanstack/react-query"

type Props = {
  profile: Profile
}

export function ChangeImage({ profile }: Props) {
  const [isOpen, setOpen] = useState<boolean>(false)
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

  const closeDialog = useCallback(() => {
    setOpen(false)
    setState("menu")
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 font-semibold text-sky-400"
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
            image={profile.image}
          />
        )}
        {state === "change" && (
          <ChangeState
            changeToMenu={changeToMenu}
            id={profile.id}
            image={profile.image}
            closeDialog={closeDialog}
          />
        )}
        {state === "remove" && (
          <RemoveState
            changeToMenu={changeToMenu}
            id={profile.id}
            image={profile.image}
            closeDialog={closeDialog}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

type MenuStateProps = {
  changeToChange: () => void
  changeToRemove: () => void
  image: Profile["image"]
}

export function MenuState({ image, changeToChange, changeToRemove }: MenuStateProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Change Image</DialogTitle>
        <DialogDescription>You can change or remove your profile image.</DialogDescription>
      </DialogHeader>
      <div>
        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#1D1D1D]">
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
        <div className="mt-4 inline-flex w-full items-center gap-2">
          <Button
            className="w-full border bg-foreground font-semibold text-accent"
            onClick={changeToChange}
          >
            Change
          </Button>
          <Button
            className="inline-flex w-full items-center gap-2 border bg-foreground font-semibold text-accent disabled:bg-accent-foreground"
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
  closeDialog: () => void
  id: Profile["id"]
  image: Profile["image"]
}

export function ChangeState({ changeToMenu, id: userId, image, closeDialog }: ChangeStateProps) {
  const updateUserProfile = useUserProfileUpdate()
  const queryClient = useQueryClient()
  const [file, setFile] = useState<{ file: File; src: string } | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const supabase = createSupabaseClient()
  const { toast } = useToast()

  const uploadFileHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.item(0) === null || e.target.files === null) {
      return
    }

    const file = e.target.files.item(0) as File

    if (file.size > 2 * 1024 * 1024) {
      toast({ description: "Max size is 2MB", variant: "destructive" })
      setFile(null)
      return
    }

    if (!["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type)) {
      toast({ variant: "destructive", description: "Invalid file type!" })
      setFile(null)
      return
    }

    setFile({ file: file, src: URL.createObjectURL(file) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateHandler = async () => {
    if (!file) return

    setLoading(true)

    const { data, error } = await supabase.storage
      .from("profiles")
      .upload(`${userId}/${generateFileName(file.file.name)}`, file.file)

    if (error) {
      toast({ variant: "destructive", description: error.message })
      setLoading(false)
      return
    }

    await updateUserProfile.mutateAsync(
      { image: data.path, id: userId },
      {
        onError(error) {
          toast({ variant: "destructive", description: error.message })
        },
        onSuccess: async () => {
          if (image) await supabase.storage.from("profiles").remove([image])

          toast({ description: "Changed image successfully" })

          queryClient.setQueryData(["user-profile"], (prev: Profile) => ({
            ...prev,
            image: data.path,
          }))
        },
      }
    )

    setLoading(false)

    closeDialog()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Changing Image</DialogTitle>
      </DialogHeader>
      <div>
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md">
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
            <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
              <FontAwesomeIcon icon={faUpload} size="5x" className="text-default-200" />
              <span className="mt-2 text-sm font-light">File format: JPG / JPEG / PNG</span>
              <div className="inline-flex text-foreground">
                <label className="font-semibold underline hover:cursor-pointer">
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
              <span className="text-sm font-light">Max file size: 2 MB</span>
            </div>
          )}
        </div>
        <div className="mt-4 inline-flex w-full items-center gap-2">
          {file !== null && (
            <Button
              className="inline-flex w-full items-center gap-2 border bg-foreground font-semibold text-accent disabled:bg-accent-foreground"
              onClick={updateHandler}
            >
              {loading && <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />}
              {loading ? "Uploading..." : "Save"}
            </Button>
          )}
          <Button
            className="inline-flex w-full items-center gap-2 border bg-foreground font-semibold text-accent disabled:bg-accent-foreground"
            onClick={changeToMenu}
          >
            Back
          </Button>
        </div>
      </div>
    </>
  )
}

export function RemoveState({ changeToMenu, id: userId, image, closeDialog }: ChangeStateProps) {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState<boolean>(false)
  const updateUserProfile = useUserProfileUpdate()
  const supabase = createSupabaseClient()
  const { toast } = useToast()

  const removeImageHandler = async () => {
    setLoading(true)

    const { error } = await supabase.storage.from("profiles").remove([image!])

    if (error) {
      toast({ description: error.message, variant: "destructive" })
      setLoading(false)
      return
    }

    await updateUserProfile.mutateAsync(
      { image: null, id: userId },
      {
        onSuccess: () => {
          toast({ description: "Removed image successfully" })
          queryClient.setQueryData(["user-profile"], (prev: Profile) => ({ ...prev, image: null }))
        },
        onError(error) {
          toast({ variant: "destructive", description: error.message })
        },
      }
    )

    setLoading(false)
    closeDialog()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Remove Image</DialogTitle>
      </DialogHeader>
      <div>
        <div className="flex flex-col items-center">
          {/* Image */}
          <div className="relative mb-4 aspect-square w-48 overflow-hidden rounded-full opacity-25 dark:border-8 dark:border-white">
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

          <div className="mb-0 text-center text-2xl font-semibold text-foreground    ">
            Remove profile picture?
          </div>
          <div className="mb-4 text-center text-muted-foreground">
            Your previous picture will be removed,
            <br /> and this image will be used instead.
          </div>
          <div className="mt-4 inline-flex w-full items-center gap-2">
            <Button
              className="inline-flex w-full items-center gap-2 border bg-foreground font-semibold text-accent disabled:bg-accent-foreground"
              onClick={changeToMenu}
            >
              Cancel
            </Button>
            <Button
              className="inline-flex w-full items-center gap-2 border bg-red-400 font-semibold text-white"
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
