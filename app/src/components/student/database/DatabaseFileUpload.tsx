import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import useSupabaseClient from "@/lib/supabase/supabase-browser"
import React, { ChangeEvent, useCallback, useState } from "react"

type Props = {
  setFile: React.Dispatch<
    React.SetStateAction<{
      file: File
      src: string
    } | null>
  >
  id: string
  label: string
  isRequired?: boolean
  defaultFile?: string
}

export default function DatabaseFileUpload({
  setFile,
  id,
  label,
  isRequired = false,
  defaultFile,
}: Props) {
  const [status, SetStatus] = useState<"open" | "change">(defaultFile ? "open" : "change")
  const { toast } = useToast()
  const supabase = useSupabaseClient()

  const clearFile = useCallback(() => {
    const element = document.getElementById(id)

    if (element instanceof HTMLInputElement) element.value = ""
  }, [id])

  const uploadFileHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.item(0) === null || e.target.files === null) {
      return
    }

    const file = e.target.files.item(0) as File

    if (file.size > 2 * 1024 * 1024) {
      toast({ description: "Max size is 2MB", variant: "destructive" })
      clearFile()
      setFile(null)
      return
    }

    if (!["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type)) {
      toast({ variant: "destructive", description: "Invalid file type!" })
      clearFile()
      setFile(null)
      return
    }

    setFile({ file: file, src: URL.createObjectURL(file) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openFile = useCallback((path: string) => {
    supabase.storage
      .from("database")
      .createSignedUrl(path, 60)
      .then((res) => {
        if (res.data?.signedUrl) window.open(res.data.signedUrl, "_blank")
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="grid w-full max-w-sm items-center space-y-3">
      <Label htmlFor={id}>{label}</Label>
      {status === "open" ? (
        <div className="inline-flex items-center gap-2">
          <Button type="button" size="sm" onClick={() => openFile(defaultFile!)}>
            Open
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-400"
            onClick={() => SetStatus("change")}
          >
            change
          </Button>
        </div>
      ) : (
        <Input
          id={id}
          type="file"
          onChange={uploadFileHandler}
          accept="image/png,image/jpg,image/jpeg"
          required={isRequired}
        />
      )}
    </div>
  )
}
