"use client"

import { KabinetByID } from "@/queries/kabinet/getKabinetById"
import React, { useCallback, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "../ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"
import { useToast } from "../ui/use-toast"
import KabinetChangeStatus from "@/utils/kabinet/change-status-kabinet"
import { useQueryClient } from "@tanstack/react-query"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import editKabinet from "@/utils/kabinet/edit-kabinet"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Database } from "@/types/database"
import KabinetAddAnggota from "./user/add-anggota-kabinet"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

type Props = {
  data: KabinetByID
  disableEdit?: boolean
  kabinet_id: string
  position?: {
    name: Database["public"]["Tables"]["division"]["Row"]["name"]
    type: Database["public"]["Tables"]["division"]["Row"]["type"]
  }
}

const formSchema = z.object({
  name: z.string().min(6, { message: "At least contains 6 characters!" }),
  start_date: z.date(),
  end_date: z.date(),
})

const prokerSchema = z.object({
  name: z.string().min(4, { message: "At least contains 4 characters!" }),
  description: z.string().min(6, { message: "At least contains 6 characters!" }),
  tujuan: z.string().min(6, { message: "At least contains 6 characters!" }),
  audience: z.string().min(6, { message: "At least contains 6 characters!" }),
  place: z.string().min(6, { message: "At least contains 6 characters!" }),
  status: z.enum(["requesting", "approved", "rejected"]),
  division_id: z.string().min(1, { message: "Divisi is required!" }),
  time_type: z.enum(["daily", "weekly", "monthly", "yearly"]),
  time_repition: z.number(),
  time_day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
  pj_id: z.string().min(1, { message: "Divisi is required!" }),
})

export default function KabinetSettings({
  data,
  kabinet_id,
  disableEdit = false,
  position,
}: Props) {
  const [isOpen, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
    },
  })

  const prokerForm = useForm<z.infer<typeof prokerSchema>>({
    resolver: zodResolver(prokerSchema),
    defaultValues: {
      name: "",
      description: '',
      audience: '', 
      division_id: '',
      pj_id: '',
      place: '',
      status: 'requesting',
      time_day: 'sunday',
      time_repition: 1,
      time_type: 'weekly',
      tujuan: ''
    },
  })

  const submitHandler = useCallback(
    async (formData: z.infer<typeof formSchema>) => {
      const res = await editKabinet({
        id: data.id,
        name: formData.name,
        start_date: formData.start_date.toDateString(),
        end_date: formData.end_date.toDateString(),
      })
      toast({
        variant: res.status === "error" ? "destructive" : "default",
        description: res.message,
      })
      if (res.status === "success") {
        queryClient.setQueryData(
          ["kabinet", data.id],
          (prev: KabinetByID): KabinetByID => ({
            ...prev,
            name: formData.name,
            start_date: formData.start_date.toDateString(),
            end_date: formData.end_date.toDateString(),
          })
        )
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const prokerSubmitHandler = useCallback(
    async (formData: z.infer<typeof prokerSchema>) => {
      console.log("Form: ", JSON.stringify(formData, null, 2))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const changeStatus = useCallback(async (kabinetId: string, status: boolean) => {
    toast({ description: `${status ? "show" : "hid"}ing the kabinet...` })
    const { message, status: resStatus } = await KabinetChangeStatus({ kabinetId, status })

    toast({ description: message, variant: resStatus === "error" ? "destructive" : "default" })

    if (resStatus === "success") {
      queryClient.setQueryData(["kabinet", data.id], (prev: KabinetByID) => ({
        ...prev,
        isShow: status,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!disableEdit)
    return (
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left" align="start">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Edit Kabinet</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="min-w-96 p-4">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(submitHandler)}
                        className="flex flex-col gap-2"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel>Nama Kabinet</FormLabel>
                              <FormControl>
                                <Input placeholder="Start Up" type="text" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="start_date"
                          render={({ field }) => (
                            <FormItem className="flex w-full flex-col">
                              <FormLabel>Start Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>Tanggal kabinet dibentuk.</FormDescription>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="end_date"
                          render={({ field }) => (
                            <FormItem className="flex w-full flex-col">
                              <FormLabel>End Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>Tanggal kabinet berakhir.</FormDescription>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          disabled={form.formState.isSubmitting}
                          className="mt-2 inline-flex items-center gap-2"
                        >
                          {form.formState.isSubmitting ? (
                            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                          ) : (
                            ""
                          )}
                          {form.formState.isSubmitting ? "Loading..." : "Save"}
                        </Button>
                      </form>
                    </Form>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={() => changeStatus(data.id, !data.isShow)}>
                {data.isShow ? "Hide" : "Show"}
              </DropdownMenuItem>
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <span>Add anggota</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <SheetTrigger asChild>
                <DropdownMenuItem>
                  <span>Add Proker</span>
                </DropdownMenuItem>
              </SheetTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Proker</SheetTitle>
              <SheetDescription>Tambah Program Kerja ke salah satu divisi.</SheetDescription>
            </SheetHeader>
            <Form {...prokerForm}>
              <form onSubmit={prokerForm.handleSubmit(prokerSubmitHandler)} className="flex flex-col gap-2">
                <FormField
                  control={prokerForm.control}
                  name="name"
                  render={({ field }) => (
                    <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-left">
                  Name
                </Label>
                <Input id="name" className="col-span-3" placeholder="Nama Program" />
              </div>
                    <FormItem className="space-y-1">
                      <FormLabel>Nama Kabinet</FormLabel>
                      <FormControl>
                        <Input placeholder="Start Up" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="mt-2 inline-flex items-center gap-2"
                >
                  {form.formState.isSubmitting ? (
                    <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                  ) : (
                    ""
                  )}
                  {form.formState.isSubmitting ? "Loading..." : "Save"}
                </Button>
              </form>
            </Form>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-left">
                  Name
                </Label>
                <Input id="name" className="col-span-3" placeholder="Nama Program" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="mt-2 text-left">
                  Description
                </Label>
                <Textarea id="description" className="col-span-3" placeholder="Deskripsi Program" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="tujuan" className="mt-2 text-left">
                  Tujuan
                </Label>
                <Textarea id="tujuan" className="col-span-3" placeholder="Tujuan Program" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="audience" className="text-left">
                  Target Peserta
                </Label>
                <Input id="audience" className="col-span-3" placeholder="Anggota PPI Karabuk" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time_type" className="text-left">
                  Tipe Waktu
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih tipe waktu" />
                  </SelectTrigger>
                  <SelectContent id="time_type">
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <DialogContent>
          <KabinetAddAnggota
            kabinetData={data}
            kabinet_id={kabinet_id}
            queryClient={queryClient}
            setOpen={setOpen}
            position={position}
          />
        </DialogContent>
      </Dialog>
    )
}
