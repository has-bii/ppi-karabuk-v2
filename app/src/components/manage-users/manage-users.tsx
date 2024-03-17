"use client"

import React, { useCallback, useMemo, useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { getImageFromS3 } from "@/utils/S3"
import { Profile } from "@/types/model"
import getDate from "@/utils/getDate"
import Image from "next/image"
import dummypp from "@/assets/images/dummy-pp.png"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import changeUserStatus from "@/utils/manage-users/changeUserStatus"
import UserRole from "@/components/user/Role"
import { Role } from "@/types/enum"
import changeUserRole from "@/utils/manage-users/changeUserRole"

type Props = {
  dataProp: Profile[]
}

export default function ManageUsers({ dataProp }: Props) {
  const [data, setData] = useState<Profile[]>(dataProp)
  const { toast } = useToast()

  const changeStatusHandler = useCallback(async (user_id: string, status: boolean) => {
    toast({ description: "Changing user status..." })

    const res = await changeUserStatus({ user_id, status })

    toast({ description: res.message, variant: res.status === "error" ? "destructive" : "default" })

    if (res.status === "error") return

    setData((prev) =>
      prev.map((item) => {
        if (item.id === user_id) {
          item.isActive = status
        }
        return item
      })
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeRoleHandler = useCallback(
    async (user_id: string, current: Role[] | null, updated: Role) => {
      toast({ description: "Changing user role..." })

      let role = current || []

      if (role.includes(updated)) role = role.filter((item) => item !== updated)
      else role.push(updated)

      const res = await changeUserRole({ user_id, role: role })

      toast({
        description: res.message,
        variant: res.status === "error" ? "destructive" : "default",
      })

      if (res.status === "error") return

      setData((prev) =>
        prev.map((item) => {
          if (item.id === user_id) {
            item.user_role.role = role
          }
          return item
        })
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const columns: ColumnDef<Profile>[] = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const image = row.original.image
          return (
            <div className="inline-flex items-center gap-2 pl-4">
              <div className="relative aspect-square w-10 overflow-hidden rounded-full">
                <Image
                  alt=""
                  src={image ? getImageFromS3(image, "profiles") : dummypp}
                  fill
                  sizes="10vw"
                  className="object-cover"
                />
              </div>
              <div className="whitespace-nowrap capitalize">{row.original.name || "no name"}</div>
            </div>
          )
        },
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        id: "Status",
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
      },
      {
        id: "Role",
        accessorKey: "user_role",
        header: "Role",
        cell: ({ row }) => {
          const {
            user_role: { role },
          } = row.original

          return (
            <div className="inline-flex gap-1 text-xs">
              <UserRole role={role} />
            </div>
          )
        },
      },
      {
        id: "Created at",
        accessorKey: "created_at",
        header: ({ column }) => (
          <button
            className="inline-flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="whitespace-nowrap capitalize">{getDate(row.original.created_at)}</div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const {
            id,
            user_role: { role },
          } = row.original

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
                <DropdownMenuItem onClick={() => changeStatusHandler(id, true)}>
                  Activate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeStatusHandler(id, false)}>
                  Inactivate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Role</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={role?.includes("ADMIN")}
                  onClick={() => changeRoleHandler(id, role, "ADMIN")}
                >
                  Admin
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={role?.includes("BPH")}
                  onClick={() => changeRoleHandler(id, role, "BPH")}
                >
                  BPH
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={role?.includes("STUDENT")}
                  onClick={() => changeRoleHandler(id, role, "STUDENT")}
                >
                  Student
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return <DataTable columns={columns} data={data} defaultVisibility={{ email: false }} />
}
