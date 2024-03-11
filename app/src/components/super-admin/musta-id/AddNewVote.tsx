import { createNewVote } from "@/app/(main)/super-admin/musta/[slug]/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/context/ToastContext"
import { Database } from "@/types/database"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { Dispatch, FormEvent, SetStateAction, useCallback, useState } from "react"

type Props = {
  musta: Database["public"]["Tables"]["musta"]["Row"]
  setMustaVote: Dispatch<
    SetStateAction<
      {
        created_at: string
        id: string
        musta_id: string
        name: string
      }[]
    >
  >
}

export default function AddNewVote({ setMustaVote, musta }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const { pushToast } = useToast()

  const submitHandler = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const formData = new FormData(e.currentTarget)

      const name = formData.get("name")

      if (!name) return

      setLoading(true)

      const res = await createNewVote(musta.id, name.toString())

      setLoading(false)

      pushToast(res.message, res.status)

      if (res.status === "success") setMustaVote((prev) => [res.data, ...prev])
    },
    [musta.id, setMustaVote, pushToast]
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" className="w-fit">
          Add new
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create new</h4>
            <p className="text-sm text-muted-foreground">Set name for this {musta.name}</p>
          </div>
          <div className="grid gap-2">
            <form onSubmit={submitHandler} className="grid grid-cols-3 items-center gap-4">
              <Label>Name</Label>
              <Input
                placeholder="Pemilihan ketua"
                className="col-span-2 h-8"
                name="name"
                required
              />
              <Button type="submit" size="sm" className="col-span-3 inline-flex gap-2 items-center">
                {loading && <FontAwesomeIcon icon={faCircleNotch} />}
                {loading ? "Creating..." : "Create"}
              </Button>
            </form>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
