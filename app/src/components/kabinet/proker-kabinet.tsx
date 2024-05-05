"use client"
import useKabinetByIdQuery from "@/hooks/kabinet/byId/useKabinetByIdQuery"
import { KabinetByID } from "@/queries/kabinet/getKabinetById"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { useCallback, useMemo } from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { MoreHorizontal } from "lucide-react"
import { useToast } from "../ui/use-toast"
import kabinetProkerStatusChange from "@/utils/kabinet/proker/kabinet-change-status-proker"
import kabinetProkerDelete from "@/utils/kabinet/proker/kabinet-delete.proker"

type Props = {
  kabinetId: string
  initialData: KabinetByID
}

type ChangeStatusParams = {
  id: string
  status: "requesting" | "approved" | "rejected"
  name: string
}

type DeleteProkerParams = {
  id: string
  kabinet_id: string
  name: string
}

export default function KabinetProker({ initialData, kabinetId }: Props) {
  const { data, error } = useKabinetByIdQuery(kabinetId, initialData)
  const { toast } = useToast()

  const changeStatus = useCallback(async (params: ChangeStatusParams) => {
    toast({ description: `Changing ${params.name} status...` })

    const { message, status } = await kabinetProkerStatusChange(params)

    toast({ description: message, variant: status === "error" ? "destructive" : "default" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteProker = useCallback(async (params: DeleteProkerParams) => {
    toast({ description: `Deleting ${params.name}...` })

    const { message, status } = await kabinetProkerDelete(params)

    toast({ description: message, variant: status === "error" ? "destructive" : "default" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns: ColumnDef<KabinetByID["proker"][0]>[] = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: () => <span className="ml-3">Nama</span>,
        cell: ({ row }) => <span className="ml-3 whitespace-nowrap">{row.original.name}</span>,
      },
      {
        id: "status",
        accessorKey: "status",
        header: () => <span className="ml-3">Status</span>,
        cell: ({ row }) => (
          <span
            className={`ml-3 whitespace-nowrap rounded-full px-2 py-1 text-xs text-background ${row.original.status === "requesting" ? "bg-foreground" : row.original.status === "rejected" ? "bg-red-400" : "bg-green-400"}`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        id: "division",
        accessorKey: "division",
        header: () => <span className="ml-3">Divisi</span>,
        cell: ({ row }) => (
          <span className="ml-3 whitespace-nowrap">{row.original.division?.name}</span>
        ),
      },
      {
        id: "description",
        accessorKey: "description",
        header: () => <span className="ml-3">Deskripsi</span>,
        cell: ({ row }) => (
          <span className="ml-3 whitespace-nowrap">{row.original.description}</span>
        ),
      },
      {
        id: "tujuan",
        accessorKey: "tujuan",
        header: () => <span>Tujuan</span>,
        cell: ({ row }) => <div className="min-w-96">{row.original.tujuan}</div>,
      },
      {
        id: "audience",
        accessorKey: "audience",
        header: () => <span className="ml-3 whitespace-nowrap">Target Peserta</span>,
        cell: ({ row }) => <span className="ml-3 whitespace-nowrap">{row.original.audience}</span>,
      },
      {
        id: "pj",
        accessorKey: "pj",
        header: () => <span className="ml-3 whitespace-nowrap">Penanggung Jawab</span>,
        cell: ({ row }) => (
          <span className="ml-3 whitespace-nowrap capitalize">{row.original.profiles?.name}</span>
        ),
      },
      {
        id: "time_type",
        accessorKey: "time_type",
        header: () => <span className="ml-3 whitespace-nowrap">Tipe Waktu</span>,
        cell: ({ row }) => (
          <span className="ml-3 whitespace-nowrap capitalize">{row.original.time_type}</span>
        ),
      },
      {
        id: "time_repetition",
        accessorKey: "time_repetition",
        header: () => <span className="ml-3 whitespace-nowrap">Repetisi Waktu</span>,
        cell: ({ row }) => (
          <span className="ml-3 whitespace-nowrap capitalize">{row.original.time_repetition}</span>
        ),
      },
      {
        id: "time_day",
        accessorKey: "time_day",
        header: () => <span className="ml-3 whitespace-nowrap">Hari</span>,
        cell: ({ row }) => (
          <span className="ml-3 whitespace-nowrap capitalize">{row.original.time_day}</span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const { status, name, id } = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={status === "requesting"}
                  onClick={() => changeStatus({ id, name, status: "requesting" })}
                >
                  Requesting
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={status === "approved"}
                  onClick={() => changeStatus({ id, name, status: "approved" })}
                >
                  Approve
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={status === "rejected"}
                  onClick={() => changeStatus({ id, name, status: "rejected" })}
                >
                  Reject
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-medium">Edit Proker</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="font-medium text-red-400"
                  onClick={() => deleteProker({ id, name, kabinet_id: kabinetId })}
                >
                  Delete Proker
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  if (data)
    return (
      <>
        <div className="w-full space-y-4 lg:space-y-2">
          <DataTable
            columns={columns}
            data={data.proker}
            filteringByName={false}
            showColumnVisibility={false}
          />
        </div>
      </>
    )

  if (error) return <div>{error.message}</div>
}
