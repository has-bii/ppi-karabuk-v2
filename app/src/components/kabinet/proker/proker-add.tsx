"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { KabinetByID, UserPosition } from "@/queries/kabinet/getKabinetById"
import { Database } from "@/types/database"
import kabinetProkerAdd, { Proker } from "@/utils/kabinet/proker/kabinet-add-proker"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, useCallback } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

type NullableProker = Omit<Proker, "created_at"> & {
  created_at?: string
}

type Props = {
  kabinetId: string
  isOpen: boolean
  setOpenProker: Dispatch<React.SetStateAction<boolean>>
  data: KabinetByID
  defaultValue?: NullableProker
  userPosition?: UserPosition
}

const prokerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(4, { message: "At least contains 4 characters!" }),
  description: z.string().min(6, { message: "At least contains 6 characters!" }),
  tujuan: z.string().min(6, { message: "At least contains 6 characters!" }),
  audience: z.string().min(6, { message: "At least contains 6 characters!" }),
  status: z.enum(["requesting", "approved", "rejected"]),
  division_id: z.string().min(1, { message: "Divisi is required!" }),
  time_type: z.enum(["daily", "weekly", "monthly", "yearly"]),
  time_repetition: z.string(),
  time_day: z
    .enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])
    .optional(),
  pj_id: z.string().min(1, { message: "PJ is required!" }),
})

export default function ProkerAdd({
  kabinetId,
  isOpen,
  setOpenProker,
  data,
  defaultValue,
  userPosition,
}: Props) {
  const { toast } = useToast()

  // Proker Form
  const prokerForm = useForm<z.infer<typeof prokerSchema>>({
    resolver: zodResolver(prokerSchema),
    defaultValues: {
      name: "",
      description: "",
      audience: "",
      division_id: userPosition?.division_id || "",
      pj_id: "",
      time_repetition: "1",
      status: "requesting",
      time_type: "weekly",
      tujuan: "",
    },
    values:
      defaultValue !== undefined
        ? {
            ...defaultValue,
            time_repetition: defaultValue.time_repetition.toString(),
            time_day: defaultValue.time_day || undefined,
          }
        : undefined,
  })

  const division_id_selected = prokerForm.watch("division_id")

  const prokerSubmitHandler = useCallback(
    async (formData: z.infer<typeof prokerSchema>) => {
      switch (formData.time_type) {
        case "weekly":
          if (!formData.time_day) prokerForm.setError("time_day", { message: "This is required!" })
          if (formData.time_repetition === "0")
            prokerForm.setError("time_repetition", { message: "This is required!" })

          if (!formData.time_day || formData.time_repetition === "0") return
          break

        case "daily":
          if (formData.time_repetition === "0") {
            prokerForm.setError("time_repetition", { message: "This is required!" })
            return
          }
          break

        case "monthly":
          if (formData.time_repetition === "0") {
            prokerForm.setError("time_repetition", { message: "This is required!" })
            return
          }
          break

        case "yearly":
          if (formData.time_repetition === "0") {
            prokerForm.setError("time_repetition", { message: "This is required!" })
            return
          }
          break

        default:
          break
      }

      const { message, status } = await kabinetProkerAdd({
        ...formData,
        time_repetition: parseInt(formData.time_repetition),
        kabinet_id: kabinetId,
        time_day:
          formData.time_type === "weekly"
            ? (formData.time_day as Database["public"]["Enums"]["Days"])
            : null,
      })

      toast({ description: message, variant: status === "error" ? "destructive" : "default" })

      if (status === "success") setOpenProker(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kabinetId]
  )

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Add Proker</SheetTitle>
        <SheetDescription>Tambah Program Kerja ke salah satu divisi.</SheetDescription>
      </SheetHeader>
      <Form {...prokerForm}>
        <form onSubmit={prokerForm.handleSubmit(prokerSubmitHandler)} className="grid gap-4 py-2">
          {/* Divisi */}
          <FormField
            control={prokerForm.control}
            name="division_id"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="whitespace-nowrap text-left">Divisi</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="col-span-3 capitalize">
                      <SelectValue placeholder="Pilih Divisi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="capitalize">
                    {data.division
                      .filter((div) =>
                        userPosition === undefined ? true : div.id === userPosition.division_id
                      )
                      .map((divisi) => (
                        <SelectItem key={divisi.id} value={divisi.id}>
                          {divisi.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="col-span-1"></div>
                <FormMessage className="col-span-3" />
              </FormItem>
            )}
          />

          {/* Nama */}
          <FormField
            control={prokerForm.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="text-left">Nama</FormLabel>
                <FormControl>
                  <Input placeholder="TOBAT" className="col-span-3" type="text" {...field} />
                </FormControl>
                <div className="col-span-1"></div>
                <FormMessage className="col-span-3" />
              </FormItem>
            )}
          />

          {/* Deskripsi */}
          <FormField
            control={prokerForm.control}
            name="description"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-start gap-x-4">
                <FormLabel className="mt-2 text-left">Deskripsi</FormLabel>
                <FormControl>
                  <Textarea placeholder="Deskripsi program" className="col-span-3" {...field} />
                </FormControl>
                <div className="col-span-1"></div>
                <FormMessage className="col-span-3" />
              </FormItem>
            )}
          />

          {/* Tujuan */}
          <FormField
            control={prokerForm.control}
            name="tujuan"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-start gap-x-4">
                <FormLabel className="mt-2 text-left">Tujuan</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tujuan program" className="col-span-3" {...field} />
                </FormControl>
                <div className="col-span-1"></div>
                <FormMessage className="col-span-3" />
              </FormItem>
            )}
          />

          {/* Target */}
          <FormField
            control={prokerForm.control}
            name="audience"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="text-left">Target</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Anggota PPI Karabuk"
                    className="col-span-3"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <div className="col-span-1"></div>
                <FormMessage className="col-span-3" />
              </FormItem>
            )}
          />

          {/* Tipe Waktu */}
          <FormField
            control={prokerForm.control}
            name="time_type"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="whitespace-nowrap text-left">Tipe Waktu</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih mingguan, bulanan atau tahunan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <div className="col-span-1"></div>
                <FormMessage className="col-span-3" />
              </FormItem>
            )}
          />

          {/* Repetisi Waktu */}
          <FormField
            control={prokerForm.control}
            name="time_repetition"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="text-left">Repetisi</FormLabel>
                <FormControl>
                  <Input placeholder="1" className="col-span-3" type="number" {...field} />
                </FormControl>
                <div className="col-span-1"></div>
                <FormMessage className="col-span-3" />
              </FormItem>
            )}
          />

          {/* Hari Waktu */}
          <FormField
            control={prokerForm.control}
            name="time_day"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="whitespace-nowrap text-left">Hari</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="col-span-3 capitalize">
                      <SelectValue placeholder="Pilih hari" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="capitalize">
                    {[
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="col-span-1"></div>
                <FormMessage className="col-span-3" />
              </FormItem>
            )}
          />

          {/* PJ */}
          <FormField
            control={prokerForm.control}
            name="pj_id"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="whitespace-nowrap text-left">PJ</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="col-span-3 capitalize">
                      <SelectValue placeholder="Pilih penanggung jawab program" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="capitalize">
                    {/* {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))} */}
                    {data.division_user
                      .filter((user) => user.division_id === division_id_selected)
                      .map((filtered) => (
                        <SelectItem key={filtered.user_id} value={filtered.user_id}>
                          {filtered.profiles?.name || "No Name"}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="col-span-1"></div>
                <FormMessage className="col-span-3" />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={prokerForm.control}
            name="status"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="whitespace-nowrap text-left">Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="col-span-3 capitalize">
                      <SelectValue placeholder="Pilih Proker Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="capitalize">
                    {["requesting", "approved", "rejected"].map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="col-span-1"></div>
                <FormMessage className="col-span-3" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={prokerForm.formState.isSubmitting}
            className="mt-2 inline-flex items-center gap-2"
          >
            {prokerForm.formState.isSubmitting ? (
              <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
            ) : (
              ""
            )}
            {prokerForm.formState.isSubmitting
              ? "Loading..."
              : prokerForm.getValues("id")
                ? "Perbarui Program"
                : "Tambah Program"}
          </Button>
        </form>
      </Form>
    </SheetContent>
  )
}
