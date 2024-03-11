"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import getDate from "@/utils/getDate"
import { useRef, useState } from "react"
import AddNewVote from "./AddNewVote"
import { useToast } from "@/context/ToastContext"
import { deleteVote } from "@/app/(main)/super-admin/musta/[slug]/actions"
import { useRouter } from "next/navigation"
import Candidate from "../candidate/Candidate"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
  dataProps: {
    created_at: string
    id: string
    name: string
    musta_file: {
      created_at: string
      file: string
      id: string
      musta_id: string
      name: string
    }[]
    musta_vote: {
      created_at: string
      id: string
      musta_id: string
      name: string
    }[]
  }
}

export default function MustaById({ dataProps }: Props) {
  const [mustaFile, setMustaFile] = useState<Props["dataProps"]["musta_file"]>(dataProps.musta_file)
  const [mustaVote, setMustaVote] = useState<Props["dataProps"]["musta_vote"]>(dataProps.musta_vote)
  const [selectedVote, setSelectedVote] = useState<string | null>(null)
  const deleteButtonRef = useRef<HTMLButtonElement>(null)
  const { pushToast } = useToast()

  const deleteHandler = async (id: string) => {
    pushToast("Deleting vote...", "normal")

    const res = await deleteVote(id, dataProps.id)

    if (res.status === "success") {
      setMustaVote((prev) => prev.filter((item) => item.id !== id))
      pushToast("Deleted vote successfully", "success")
    }

    setSelectedVote(null)
  }

  return (
    <>
      {/* Delete dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <button ref={deleteButtonRef}></button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete vote and remove all data
              belong to it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (selectedVote) deleteHandler(selectedVote)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <h1 className="text-3xl font-bold capitalize">{dataProps.name}</h1>

      <div className="flex flex-wrap gap-4 mt-6">
        {/* Details */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Musta Details</CardTitle>
            <CardDescription>Change Musta name will be the next feature.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <span className="text-muted-foreground">Name</span>
                <span className="block">{dataProps.name}</span>
              </div>

              <div>
                <span className="text-muted-foreground">Number of Files</span>
                <span className="block">{mustaFile.length === 0 ? "none" : mustaFile.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Created at</span>
                <span className="block">{getDate(dataProps.created_at)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Number of Votes</span>
                <span className="block">{mustaVote.length === 0 ? "none" : mustaVote.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add new Vote */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="inline-flex justify-between items-start">
              New Vote <AddNewVote setMustaVote={setMustaVote} musta={dataProps} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4">Name</TableHead>
                    <TableHead className="px-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mustaVote.length !== 0 ? (
                    mustaVote.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="inline-flex gap-2 w-full">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="ml-auto"
                            onClick={() => {
                              setSelectedVote(item.id)
                              deleteButtonRef.current?.click()
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        There is no data.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add candidate */}
        <Candidate mustaVote={mustaVote} />
      </div>
    </>
  )
}
