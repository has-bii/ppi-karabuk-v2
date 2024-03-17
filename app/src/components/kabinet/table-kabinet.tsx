"use client"

import useKabinetQuery from "@/hooks/kabinet/useKabinetQuery"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Database } from "@/types/database"
import { useMemo } from "react"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import getDate from "@/utils/getDate"
import { useRouter } from "next/navigation"
import { SkeletonTable } from "@/components/skeleton/SkeletonTable"

type Kabinet = Database["public"]["Tables"]["kabinet"]["Row"]

type Props = {
  path: string
  initialData: Kabinet[]
}

export default function TableKabinet({ path, initialData }: Props) {
  const { data, isLoading, error } = useKabinetQuery(initialData)
  const router = useRouter()

  const columns: ColumnDef<Kabinet>[] = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <button
            className="ml-2 inline-flex items-center gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        ),
        cell: ({ row }) => <span className="ml-2 capitalize">{row.original.name}</span>,
      },
      {
        id: "Periode",
        header: "Periode",
        cell: ({ row }) => {
          return (
            <div className="whitespace-nowrap">{`${getDate(row.original.start_date)} - ${getDate(row.original.end_date)}`}</div>
          )
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`${path}/kabinet/${row.original.id}`)}>
                  Open
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

  if (isLoading || !data) return <SkeletonTable />

  if (error) return error.message

  return <DataTable columns={columns} data={data} />
}
