"use client"

import { KabinetByID } from "@/queries/kabinet/getKabinetById"
import React, { useCallback } from "react"
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
import { endOfYear, format } from "date-fns"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import editKabinet from "@/utils/kabinet/edit-kabinet"

type Props = {
  data: KabinetByID
}

const formSchema = z.object({
  name: z.string().min(6, { message: "At least contains 6 characters!" }),
  start_date: z.date(),
  end_date: z.date(),
})

export default function KabinetSettings({ data }: Props) {
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

  return (
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
                <form onSubmit={form.handleSubmit(submitHandler)} className="flex flex-col gap-2">
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
