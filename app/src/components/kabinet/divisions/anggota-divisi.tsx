"use client"

import useKabinetByIdQuery from "@/hooks/kabinet/byId/useKabinetByIdQuery"
import { KabinetByID } from "@/queries/kabinet/getKabinetById"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { getImageFromS3 } from "@/utils/S3"
import { useCallback, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
import deleteAnggotaDivisi from "@/utils/kabinet/anggota-divisi/delete-anggota"
import { useToast } from "@/components/ui/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Database } from "@/types/database"
import useUserProfileQuery from "@/hooks/user-profile/useUserProfileQuery"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Props = {
  kabinetId: string
  disableEdit?: boolean
  position?: {
    name: Database["public"]["Tables"]["division"]["Row"]["name"]
    type: Database["public"]["Tables"]["division"]["Row"]["type"]
  }
  initialData: KabinetByID
  division_id?: string
}

export default function AnggotaDivisi({
  kabinetId,
  disableEdit = false,
  position,
  initialData,
  division_id,
}: Props) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data } = useKabinetByIdQuery(kabinetId, initialData)
  const { data: userProfile } = useUserProfileQuery()

  const deleteHandler = useCallback(
    async (id: string, name: string, divisionName: string) => {
      const { status, message } = await deleteAnggotaDivisi({ id, name, divisionName })

      toast({ variant: status === "error" ? "destructive" : "default", description: message })

      if (status === "success")
        queryClient.setQueryData(["kabinet", kabinetId], (prev: KabinetByID) => {
          prev.division_user = prev.division_user.filter((item) => item.id !== id)

          return prev
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kabinetId]
  )

  const columns: ColumnDef<KabinetByID["division_user"][0]>[] = useMemo(
    () => [
      {
        id: "divisi",
        accessorKey: "division",
        header: () => <span className="ml-3">Divisi</span>,
        cell: ({ row }) => (
          <span className="ml-3 whitespace-nowrap">{row.original.division?.name}</span>
        ),
      },
      {
        id: "posisi",
        header: "Posisi",
        cell: ({ row }) => (
          <Badge variant={row.original.division_user_type === "ketua" ? "default" : "secondary"}>
            {row.original.division_user_type}
          </Badge>
        ),
      },
      {
        id: "name",
        header: "Anggota",
        cell: ({ row }) => {
          const user = row.original.profiles

          return (
            <div className="inline-flex items-center gap-2 capitalize">
              <Avatar>
                {user?.image ? (
                  <AvatarImage
                    src={getImageFromS3(user.image, "profiles")}
                    className="object-cover"
                  />
                ) : (
                  ""
                )}
                <AvatarFallback>
                  {user?.name
                    ? user.name
                        .split(" ")
                        .slice(0, 2)
                        .map((word) => word.charAt(0).toUpperCase())
                        .join("")
                    : "NN"}
                </AvatarFallback>
              </Avatar>
              <div>{user?.name === userProfile?.name ? "You" : user?.name || "No name"}</div>
            </div>
          )
        },
      },
      {
        id: "actions",
        enableHiding: false,
        header: "Action",
        cell: ({ row }) => {
          let show = !disableEdit

          if (
            (position?.type === "ketua" || position?.type === "sekretaris") &&
            row.original.division?.type === "MPA"
          )
            show = false
          if (position?.type === "MPA" && row.original.division?.type !== "MPA") show = false

          if (show)
            return (
              <Dialog>
                <DialogTrigger asChild>
                  <Badge variant="destructive" className="py-1.5 hover:cursor-pointer">
                    <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
                    <span>Delete</span>
                  </Badge>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. Are you sure you want to permanently remove{" "}
                      <span className="font-medium capitalize text-foreground">
                        {row.original.profiles?.name || "No Name"}
                      </span>{" "}
                      from{" "}
                      <span className="font-medium text-foreground">
                        {row.original.division?.name || "No Name"}
                      </span>
                      ?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        deleteHandler(
                          row.original.id,
                          row.original.profiles?.name || "No name",
                          row.original.division?.name!
                        )
                      }
                    >
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  if (data)
    return (
      <div className="w-full space-y-4 lg:space-y-2">
        <DataTable
          columns={columns}
          data={
            division_id
              ? data.division_user.filter((item) => item.division_id === division_id)
              : data.division_user
          }
          filteringByName={false}
          showColumnVisibility={false}
        />
      </div>
    )
}
