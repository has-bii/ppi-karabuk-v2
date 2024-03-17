"use client"

import useKabinetByIdQuery from "@/hooks/kabinet/byId/useKabinetByIdQuery"
import useSupabaseClient from "@/lib/supabase/supabase-browser"
import { KabinetByID } from "@/queries/kabinet/getKabinetById"
import { DataTable } from "@/components/ui/data-table"
import dummypp from "@/assets/images/dummy-pp.png"
import { ColumnDef } from "@tanstack/react-table"
import { getImageFromS3 } from "@/utils/S3"
import Image from "next/image"
import { useCallback, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch, faTrashCan } from "@fortawesome/free-solid-svg-icons"
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
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useUsersQuery from "@/hooks/users/useUsersQuery"
import anggotaDivisiAdd from "@/utils/kabinet/anggota-divisi/add-anggota"

type Props = {
  kabinetId: string
}

const formSchema = z
  .object({
    user_id: z.string().min(1, "Anggota belum dipilih!"),
    division_id: z.string().min(1, "Divisi belum dipilih!"),
    division_user_type: z.enum(["anggota", "ketua"], { required_error: "Posisi belum dipilih!" }),
  })
  .required({ division_id: true, division_user_type: true, user_id: true })

export default function AnggotaDivisi({ kabinetId }: Props) {
  const [isOpen, setOpen] = useState<boolean>(false)
  const supabase = useSupabaseClient()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data } = useKabinetByIdQuery(supabase, kabinetId)
  const { data: users } = useUsersQuery()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      division_id: "",
      division_user_type: "anggota",
      user_id: "",
    },
  })

  const submitHandler = useCallback(
    async (formData: z.infer<typeof formSchema>) => {
      console.log("Form: ", formData)

      const res = await anggotaDivisiAdd({ ...formData, kabinet_id: kabinetId })

      toast({
        variant: res.status === "error" ? "destructive" : "default",
        description: res.message,
      })

      if (res.status === "success") {
        queryClient.setQueryData(["kabinet", kabinetId], (prev: KabinetByID) => {
          prev.division_user.push(res.data)

          return prev
        })

        form.reset()

        setOpen(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kabinetId]
  )

  const deleteHandler = useCallback(
    async (id: string, name: string, divisionName: string) => {
      const { status, message } = await deleteAnggotaDivisi({ id, name, divisionName })

      toast({ variant: status === "error" ? "destructive" : "default", description: message })

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
        cell: ({ row }) => <span className="ml-3">{row.original.division?.name}</span>,
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
            <div className="inline-flex items-center gap-2">
              <div className="relative aspect-square w-8 overflow-hidden rounded-full">
                <Image
                  alt=""
                  src={user?.image ? getImageFromS3(user.image, "profiles") : dummypp}
                  fill
                  sizes="10vw"
                  className="object-cover"
                />
              </div>

              <span className="capitalize">{user?.name || "No name"}</span>
            </div>
          )
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
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
        <div className="inline-flex w-full">
          <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="ml-auto">
                Tambah Anggota
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-left">Tambah Anggota</DialogTitle>
                <DialogDescription className="text-left">
                  Tambah seorang anggota ke dalam divisi.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(submitHandler)} className="grid space-y-2">
                  {/* Users */}
                  <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">Anggota</FormLabel>
                          <div className="col-span-3">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih user sebagai anggota..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {users
                                  ?.filter((item) => !!item.name)
                                  .map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.name || ""}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Divisi */}
                  <FormField
                    control={form.control}
                    name="division_id"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">Divisi</FormLabel>
                          <div className="col-span-3">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih divisi..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {data.division.map((divisi) => (
                                  <SelectItem key={divisi.id} value={divisi.id}>
                                    {divisi.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Posisi */}
                  <FormField
                    control={form.control}
                    name="division_user_type"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">Posisi</FormLabel>
                          <div className="col-span-3">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih posisi..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ketua">Ketua</SelectItem>
                                <SelectItem value="anggota">Anggota</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="inline-flex w-full">
                    <Button
                      type="submit"
                      className="ml-auto"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting && (
                        <FontAwesomeIcon icon={faCircleNotch} className="mr-2 animate-spin" />
                      )}
                      Tambah
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <DataTable
          columns={columns}
          data={data.division_user}
          filteringByName={false}
          showColumnVisibility={false}
        />
      </div>
    )
}
