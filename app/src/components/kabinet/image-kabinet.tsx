"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch, faImage, faUpload } from "@fortawesome/free-solid-svg-icons"
import { useQueryClient } from "@tanstack/react-query"
import { ChangeEvent, useCallback, useState } from "react"
import { useToast } from "../ui/use-toast"
import useSupabaseClient from "@/lib/supabase/supabase-browser"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { setFileName } from "@/utils/generateFileName"
import KabinetUploadImage from "@/utils/kabinet/image/upload-image-kabinet"
import { KabinetByID } from "@/queries/kabinet/getKabinetById"
import useKabinetByIdQuery from "@/hooks/kabinet/byId/useKabinetByIdQuery"
import { openPublicFile } from "@/utils/S3"

type Props = {
  id: string
  disableChange?: boolean
}

export default function KabinetImage({ id, disableChange = false }: Props) {
  const { data } = useKabinetByIdQuery(id)
  const [isOpen, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const [file, setFile] = useState<{ file: File; src: string } | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const supabase = useSupabaseClient()
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
      .from("kabinet")
      .upload(setFileName(file.file.name, id, "cover"), file.file, { upsert: true })

    if (error) {
      toast({ variant: "destructive", description: error.message })
      setLoading(false)
      return
    }

    const { message, status } = await KabinetUploadImage({ kabinetId: id, path: data.path })

    toast({ description: message, variant: status === "error" ? "destructive" : "default" })

    if (status === "success")
      queryClient.setQueryData(["kabinet", id], (prev: KabinetByID) => ({
        ...prev,
        image: data.path,
      }))

    setLoading(false)

    closeDialog()

    setFile(null)
  }

  const closeDialog = useCallback(() => setOpen(false), [])

  return (
    <div className="relative aspect-video h-auto w-full overflow-hidden rounded-md bg-foreground lg:h-96">
      {data?.image ? (
        <Image
          alt=""
          fill
          sizes="33vw"
          quality={100}
          src={openPublicFile(data.image, "kabinet", supabase)}
          className="object-cover"
        />
      ) : (
        ""
      )}

      {disableChange ? (
        " "
      ) : (
        <Dialog open={isOpen} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="absolute bottom-4 right-4 items-center"
            >
              <FontAwesomeIcon icon={faImage} className="mr-1" />
              Change Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Changing Kabinet Cover</DialogTitle>
            </DialogHeader>
            <div>
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md">
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
                  onClick={() => {
                    setFile(null)
                    closeDialog()
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
