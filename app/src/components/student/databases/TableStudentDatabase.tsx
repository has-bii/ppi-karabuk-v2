"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import useSupabaseClient from "@/lib/supabase/supabase-browser"
import { Database } from "@/types/database"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import React, { useCallback, useMemo } from "react"

type Props = {
  dataProp: Database["public"]["Tables"]["student_database"]["Row"][]
}

export default function TableStudentDatabase({ dataProp }: Props) {
  const { toast } = useToast()
  const supabase = useSupabaseClient()

  const openFile = useCallback((path: string) => {
    supabase.storage
      .from("database")
      .createSignedUrl(path, 60)
      .then((res) => {
        if (res.data) window.open(res.data.signedUrl, "_blank")
        else toast({ variant: "destructive", description: res.error.message })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns: ColumnDef<Props["dataProp"][0]>[] = [
    {
      id: "name",
      accessorKey: "name",
      enableHiding: false,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="whitespace-nowrap px-4">{row.original.name}</span>,
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span>{row.original.email}</span>,
    },
    {
      id: "TTL",
      header: "TTL",
      cell: ({ row }) => (
        <span className="whitespace-nowrap capitalize">
          {row.original.birth_place +
            ", " +
            new Date(row.original.birth_date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
        </span>
      ),
    },
    {
      id: "kontak",
      header: "Kontak",
      cell: ({ row }) => (
        <div>
          <span className="block whitespace-nowrap">WA : {row.original.no_wa}</span>
          <span className="block whitespace-nowrap">HP : {row.original.no_active}</span>
        </div>
      ),
    },
    {
      id: "domisili",
      header: "Domisili",
      cell: ({ row }) => <span className="capitalize">{row.original.domisili}</span>,
    },
    {
      id: "gender",
      header: "Gender",
      cell: ({ row }) => <span className="capitalize">{row.original.gender}</span>,
    },
    {
      id: "jurusan",
      header: "Jurusan",
      cell: ({ row }) => <span className="capitalize">{row.original.department}</span>,
    },
    {
      id: "strata",
      header: "Strata",
      cell: ({ row }) => <span>{row.original.strata}</span>,
    },
    {
      id: "tahun kedatangan",
      header: "Kedatangan",
      cell: ({ row }) => <span>{row.original.tahun_kedatangan}</span>,
    },
    {
      id: "Student ID",
      header: "Student ID",
      cell: ({ row }) => <span>{row.original.no_student}</span>,
    },
    {
      id: "TC Kimlik",
      header: "TC Kimlik",
      cell: ({ row }) => <span>{row.original.no_ikamet}</span>,
    },
    {
      id: "passport",
      header: "Passport",
      cell: ({ row }) => <span>{row.original.no_paspor}</span>,
    },
    {
      id: "Files",
      header: () => <span className="whitespace-nowrap">Files</span>,
      cell: ({ row }) => {
        const { file_student, file_ikamet, file_paspor } = row.original

        return (
          <div className="inline-flex items-center gap-2">
            <Button size="sm" onClick={() => openFile(file_student)}>
              Student
            </Button>

            {file_ikamet && (
              <Button size="sm" onClick={() => openFile(file_ikamet)}>
                Open
              </Button>
            )}

            {file_paspor && (
              <Button size="sm" onClick={() => openFile(file_paspor)}>
                Open
              </Button>
            )}
          </div>
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
              <DropdownMenuItem>Download</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={dataProp}
      defaultVisibility={{
        domisili: false,
        kontak: false,
        jurusan: false,
        gender: false,
        strata: false,
        kedatangan: false,
        TTL: false,
      }}
    />
  )
}
