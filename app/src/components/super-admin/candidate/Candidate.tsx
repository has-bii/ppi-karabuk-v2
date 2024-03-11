import {
  Candidates,
  deleteCandidate,
  fetchAllUsers,
  fetchCandidates,
} from "@/app/(main)/super-admin/musta/[slug]/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/context/ToastContext"
import { Database } from "@/types/database"
import React, { useCallback, useEffect, useRef, useState } from "react"
import NewCandidate from "./NewCandidate"
import SelectVote from "./SelectVote"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  mustaVote: Database["public"]["Tables"]["musta_vote"]["Row"][]
}

type Users = Database["public"]["Tables"]["user"]["Row"][]

export default function Candidate({ mustaVote }: Props) {
  const [selectedVote, setSelectedVote] = useState<Props["mustaVote"][0] | null>(mustaVote[0] || null)
  const [selectCandidate, setSelectCandidate] = useState<Candidates | null>(null)
  const [candidates, setCandidates] = useState<Candidates[]>([])
  const deleteButtonRef = useRef<HTMLButtonElement>(null)
  const [users, setUsers] = useState<Users>([])
  const { pushToast } = useToast()

  useEffect(() => {
    fetchAllUsers().then((res) => {
      if (res.status === "success")
        setUsers(res.data)

      if (res.status === "error") pushToast("Failed to fetch users", "error")

    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (selectedVote === null) return

    fetchCandidates(selectedVote.id).then((res) => {
      if (res.status === "success") setCandidates(res.data)
      else pushToast(res.message, res.status)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVote])

  const deleteCandidateHandler = useCallback(async (candidate_id: string | undefined) => {
    if (!candidate_id) return

    const res = await deleteCandidate(candidate_id)

    if (res.status === "success") {
      setCandidates((prev) => prev.filter((item) => item.id !== candidate_id))
    }

    pushToast(res.message, res.status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* Delete dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <button className="hidden" ref={deleteButtonRef}></button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete delete candidate</DialogTitle>
            <DialogDescription>
              Are you sure to delete{" "}
              <span className="capitalize font-semibold">{selectCandidate?.user?.name}</span> from
              the{" "}
              <span className="capitalize font-semibold">
                {selectedVote ? mustaVote.find((item) => item.id === selectedVote.id)?.name : ""}
              </span>
              ? This will permanently delete all data belong to it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <div className="inline-flex gap-2">
                <Button type="button" variant="secondary" onClick={() => setSelectCandidate(null)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => deleteCandidateHandler(selectCandidate?.id)}
                >
                  Delete
                </Button>
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Card */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Add Candidate</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add section */}
          <div className="flex-wrap flex gap-2">
            <SelectVote
              mustaVote={mustaVote}
              selectedVote={selectedVote}
              setSelectedVote={setSelectedVote}
            />
            <NewCandidate users={users} selectedVote={selectedVote} setCandidates={setCandidates} />
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-auto mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Name</TableHead>
                  <TableHead className="px-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.length !== 0 ? (
                  candidates.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="whitespace-nowrap capitalize">
                        {item.user?.name}
                      </TableCell>
                      <TableCell className="inline-flex gap-2 w-full">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="ml-auto"
                          onClick={() => {
                            setSelectCandidate(item)
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
    </>
  )
}
