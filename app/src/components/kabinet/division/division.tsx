"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import React, { useCallback } from "react"
import DivisionCreate from "./division-create"
import { KabinetByID } from "@/queries/kabinet/getKabinetById"
import { useQueryClient } from "@tanstack/react-query"
import deleteDivision from "@/utils/kabinet/division/delete-division"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useSupabaseClient from "@/lib/supabase/supabase-browser"
import useKabinetByIdQuery from "@/hooks/kabinet/byId/useKabinetByIdQuery"
import { Database } from "@/types/database"

type Props = {
  kabinetId: string
}

type DivisionType = Database["public"]["Enums"]["DivisionType"]

export default function Division({ kabinetId }: Props) {
  const { data } = useKabinetByIdQuery(kabinetId)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const deleteHandler = useCallback(
    async (division_id: string) => {
      const { message, status } = await deleteDivision({ kabinet_id: kabinetId, division_id })

      toast({ variant: status === "error" ? "destructive" : "default", description: message })

      if (status === "success")
        queryClient.setQueryData(["kabinet", kabinetId], (prev: KabinetByID) => {
          prev.division = prev.division.filter((item) => item.id !== division_id)

          return prev
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kabinetId]
  )

  const checkType = useCallback((type: DivisionType) => {
    return type === "ketua" || type === "bendahara" || type === "sekretaris" || type === "MPA"
  }, [])

  if (data)
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="inline-flex items-center justify-between">
            <span>Divisi-divisi</span>
            {/* Create a division */}
            <DivisionCreate kabinetId={kabinetId} />
          </CardTitle>
          <CardDescription>Buat divisi sebelum memasukan anggota BPH dan MPA.</CardDescription>
          <CardContent className="flex flex-col gap-2 px-0 pt-2">
            {data.division.map((data) => (
              <div key={data.id} className="inline-flex items-center gap-2 capitalize">
                <span>{data.name}</span>
                <Badge
                  variant="secondary"
                  className="ml-auto text-xs font-normal text-muted-foreground"
                >{`${data.division_user.length} anggota`}</Badge>

                {/* Action button */}
                <Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Open</DropdownMenuItem>
                      <DialogTrigger asChild disabled={checkType(data.type)}>
                        <DropdownMenuItem>
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. Are you sure you want to permanently delete
                        this <span className="font-medium text-foreground">{data.name}</span> from
                        the Kabinet?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="destructive" onClick={() => deleteHandler(data.id)}>
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </CardContent>
        </CardHeader>
      </Card>
    )
}
