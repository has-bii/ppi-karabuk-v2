"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { KabinetByID } from "@/queries/kabinet/getKabinetById"
import createDivision from "@/utils/kabinet/division/create-division"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

type Props = {
  kabinetId: string
}

const formSchema = z.object({
  name: z.string(),
})

export default function DivisionCreate({ kabinetId }: Props) {
  const { toast } = useToast()
  const [isOpen, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const submitHandler = useCallback(
    async (formData: z.infer<typeof formSchema>) => {
      const res = await createDivision({ kabinet_id: kabinetId, ...formData })

      toast({
        variant: res.status === "error" ? "destructive" : "default",
        description: res.message,
      })

      if (res.status === "success") {
        queryClient.setQueryData(["kabinet", kabinetId], (prev: KabinetByID) => {
          prev.division.push(res.data)

          return prev
        })

        setOpen(false)

        form.reset()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kabinetId]
  )

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="h-fit py-1.5">
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Divisi Baru</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="PSDM"
                      type="text"
                      {...field}
                      className="col-span-3"
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Button */}
            <DialogFooter>
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
                {form.formState.isSubmitting ? "Loading..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
