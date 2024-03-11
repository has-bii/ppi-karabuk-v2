import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Database } from "@/types/database"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { CheckIcon } from "lucide-react"
import React, { useState } from "react"

type Props = {
  mustaVote: Database["public"]["Tables"]["musta_vote"]["Row"][]
  setSelectedVote: React.Dispatch<
    React.SetStateAction<{
      created_at: string
      id: string
      musta_id: string
      name: string
    } | null>
  >
  selectedVote: {
    created_at: string
    id: string
    musta_id: string
    name: string
  } | null
}

export default function SelectVote({ mustaVote, selectedVote, setSelectedVote }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex-1 flex justify-between overflow-x-hidden"
        >
          {selectedVote
            ? mustaVote.find((musta) => musta.id === selectedVote.id)?.name
            : "Select voting..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search voting..." className="h-9" />
          <CommandEmpty>No voting found.</CommandEmpty>
          <CommandGroup>
            {mustaVote.map((musta) => (
              <CommandItem
                key={musta.id}
                value={musta.name}
                onSelect={(value) => {
                  setSelectedVote(
                    mustaVote.find((musta) => musta.name.toLowerCase() === value) || null
                  )
                  setOpen(false)
                }}
              >
                {musta.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedVote?.id === musta.id ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
