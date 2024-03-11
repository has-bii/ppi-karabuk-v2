"use client"

import { createNewMusta } from "@/app/(main)/super-admin/musta/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/context/ToastContext"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useCallback } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

type Props = {
  setMustaData: Dispatch<
    SetStateAction<
      {
        created_at: string
        id: string
        name: string
      }[]
    >
  >
}

const formSchema = z.object({
  name: z.string().min(6, "At least contains 6 characters"),
})

export default function AddNewMusta({ setMustaData }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `Musyawarah Tahunan ${new Date().getFullYear()}`,
    },
  })

  const { pushToast } = useToast()

  const submitHandler = useCallback(async (formData: z.infer<typeof formSchema>) => {
    const res = await createNewMusta(formData.name)

    pushToast(res.message, res.status)

    if (res.status === "success") setMustaData((prev) => [...prev, res.data])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card className="w-full lg:w-fit">
      <CardHeader>
        <CardTitle>Create New Musta Event</CardTitle>
        <CardDescription>You can only create one Musta event in the same year.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1 mb-2">
                  <FormLabel className="capitalize">{field.name}</FormLabel>
                  <FormControl>
                    <Input placeholder="Musyawarah Tahunan..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="inline-flex w-full gap-2">
              <Button className="ml-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                )}
                {form.formState.isSubmitting ? "Creating..." : "Create New"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
