import {
  Candidates,
  addCandidate,
  fetchCandidates,
} from "@/app/(main)/super-admin/musta/[slug]/actions"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/context/ToastContext"
import { cn } from "@/lib/utils"
import { RoleEnum } from "@/types/user"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { CheckIcon } from "lucide-react"
import React, { useCallback, useState } from "react"

type Props = {
  users: {
    created_at: string
    id: string
    image: string | null
    isActive: boolean
    name: string | null
    role: RoleEnum[]
  }[]
  selectedVote: {
    created_at: string
    id: string
    musta_id: string
    name: string
  } | null
  setCandidates: React.Dispatch<React.SetStateAction<Candidates[]>>
}

export default function NewCandidate({ users, selectedVote, setCandidates }: Props) {
  const [selectUser, setSelectUser] = useState<Props["users"][0] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const { pushToast } = useToast()

  const addHandler = async () => {
    if (!selectedVote) {
      pushToast("Voting is required!", "error")
      return
    }

    if (!selectUser) {
      pushToast("Candidate is required!", "error")
      return
    }

    setLoading(true)

    const res = await addCandidate(selectUser.id, selectedVote.id)

    if (res.status === "success") {
      setCandidates((prev) => [...prev, res.data])
    }

    pushToast(res.message, res.status)
    setLoading(false)
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex flex-1 justify-between capitalize"
          >
            {selectUser
              ? users.find((user) => user.id === selectUser.id)?.name || "noname"
              : "Select user..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search user..." className="h-9" />
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name || ""}
                  onSelect={(value) => {
                    setSelectUser(users.find((user) => user.name === value) || null)
                    setOpen(false)
                  }}
                >
                  {user.name || "noname"}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectUser?.id === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Add button */}
      <Button
        onClick={addHandler}
        disabled={loading}
        className="inline-flex flex-1 max-w-14 gap-2 items-center"
      >
        {loading && <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />}
        Add
      </Button>
    </>
  )
}
