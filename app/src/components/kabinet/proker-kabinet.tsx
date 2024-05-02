"use client"
import useKabinetByIdQuery from "@/hooks/kabinet/byId/useKabinetByIdQuery"
import { KabinetByID } from "@/queries/kabinet/getKabinetById"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

type Props = {
  kabinetId: string
  initialData: KabinetByID
}

export default function KabinetProker({ initialData, kabinetId }: Props) {
  const { data, error } = useKabinetByIdQuery(kabinetId, initialData)

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
        header: () => <span className="ml-3 whitespace-nowrap">Repitisi Waktu</span>,
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
        id: "place",
        accessorKey: "place",
        header: () => <span className="ml-3 whitespace-nowrap">Tempat</span>,
        cell: ({ row }) => (
          <span className="ml-3 whitespace-nowrap capitalize">{row.original.place}</span>
        ),
      },
    ],
    []
  )

  if (data)
    return (
      <div className="w-full space-y-4 lg:space-y-2">
        <DataTable
          columns={columns}
          data={data.proker}
          filteringByName={false}
          showColumnVisibility={false}
        />
      </div>
    )

  if (error) return <div>{error.message}</div>
}
