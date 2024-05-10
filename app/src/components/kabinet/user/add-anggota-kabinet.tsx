"use client"

import { Button } from "@/components/ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { useToast } from "@/components/ui/use-toast"
import useUsersQuery from "@/hooks/users/useUsersQuery"
import { KabinetByID, UserPosition } from "@/queries/kabinet/getKabinetById"
import { Database } from "@/types/database"
import anggotaDivisiAdd from "@/utils/kabinet/anggota-divisi/add-anggota"
import { faArrowsRotate, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { zodResolver } from "@hookform/resolvers/zod"
import { QueryClient } from "@tanstack/react-query"
import React, { useCallback } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  kabinet_id: string
  userPosition?: UserPosition
  queryClient: QueryClient
  kabinetData: KabinetByID
}

const formSchemaAnggota = z
  .object({
    user_id: z.string().min(1, "Anggota belum dipilih!"),
    division_id: z.string().min(1, "Divisi belum dipilih!"),
    division_user_type: z.enum(["anggota", "ketua"], { required_error: "Posisi belum dipilih!" }),
  })
  .required({ division_id: true, division_user_type: true, user_id: true })

export default function KabinetAddAnggota({
  kabinet_id,
  queryClient,
  setOpen,
  userPosition,
  kabinetData,
}: Props) {
  const { data: users, refetch, isRefetching } = useUsersQuery()
  const { toast } = useToast()

  const formAnggota = useForm<z.infer<typeof formSchemaAnggota>>({
    resolver: zodResolver(formSchemaAnggota),
    defaultValues: {
      division_id: "",
      division_user_type: "anggota",
      user_id: "",
    },
  })

  const addAnggotaHandler = useCallback(
    async (formData: z.infer<typeof formSchemaAnggota>) => {
      const res = await anggotaDivisiAdd({ ...formData, kabinet_id: kabinet_id })

      toast({
        variant: res.status === "error" ? "destructive" : "default",
        description: res.message,
      })

      if (res.status === "success") {
        queryClient.setQueryData(["kabinet", kabinet_id], (prev: KabinetByID) => {
          prev.division_user.push(res.data)

          return prev
        })

        formAnggota.reset()

        setOpen(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kabinet_id]
  )
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left">Tambah Anggota</DialogTitle>
        <DialogDescription className="text-left">
          Tambah seorang anggota ke dalam divisi.
        </DialogDescription>
      </DialogHeader>
      <Form {...formAnggota}>
        <form onSubmit={formAnggota.handleSubmit(addAnggotaHandler)} className="grid space-y-2">
          {/* Users */}
          <FormField
            control={formAnggota.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-left">Anggota</FormLabel>
                  <div className="col-span-3 inline-flex items-center gap-2">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih user sebagai anggota..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users
                          ?.filter(
                            (user) =>
                              !kabinetData?.division_user.some((item) => user.id === item.user_id)
                          )
                          .map((user) => (
                            <SelectItem key={user.id} value={user.id} className="capitalize">
                              {user.name || ""}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm" onClick={() => refetch()} type="button">
                      <FontAwesomeIcon
                        icon={faArrowsRotate}
                        className={isRefetching ? "animate-spin" : ""}
                      />
                    </Button>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Divisi */}
          <FormField
            control={formAnggota.control}
            name="division_id"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-left">Divisi</FormLabel>
                  <div className="col-span-3">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih divisi..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {kabinetData?.division
                          .filter((divisi) => {
                            if (userPosition?.division?.type === "divisi") {
                              return divisi.name === userPosition?.division?.name
                            } else if (userPosition?.division?.type === "MPA") {
                              return divisi.type === "MPA"
                            } else if (userPosition?.division?.type === "ketua") {
                              return divisi.type !== "MPA"
                            } else return true
                          })
                          .map((divisi) => (
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
            control={formAnggota.control}
            name="division_user_type"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-left">Posisi</FormLabel>
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
            <Button type="submit" className="ml-auto" disabled={formAnggota.formState.isSubmitting}>
              {formAnggota.formState.isSubmitting && (
                <FontAwesomeIcon icon={faCircleNotch} className="mr-2 animate-spin" />
              )}
              Tambah
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
