"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { useToast } from "@/components/ui/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { Database } from "@/types/database"
import editKabinet from "@/utils/kabinet/edit-kabinet"

type Props = {
  dataProps: Database["public"]["Tables"]["kabinet"]["Row"]
  disableEdit?: boolean
}

export default function KabinetEdit({ dataProps, disableEdit = false }: Props) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().optional(),
        // start_date: z.date(),
        // end_date: z.date(),
      }),
    []
  )
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: dataProps.name,
      // start_date: new Date(dataProps.start_date.toString()),
      // end_date: new Date(dataProps.end_date.toString()),
    },
  })

  const submitHandler = useCallback(
    async (formData: z.infer<typeof formSchema>) => {
      if (!formData.name) {
        form.setValue("name", dataProps.name)
        return
      }

      if (formData.name === dataProps.name) return

      const res = await editKabinet({
        id: dataProps.id,
        name: formData.name,
      })

      toast({
        variant: res.status === "error" ? "destructive" : "default",
        description: res.status === "error" ? res.message : "Changed the kabinet name successfully",
      })

      if (res.status === "success") {
        queryClient.setQueryData(["kabinet"], (oldData: Props["dataProps"][]) =>
          oldData?.map((prev) => {
            if (prev.id === dataProps.id) return res.data

            return prev
          })
        )
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataProps]
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        onBlur={form.handleSubmit(submitHandler)}
        className="inline-flex items-center gap-3"
      >
        {form.formState.isSubmitting && (
          <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormControl>
                <input
                  type="text"
                  className="w-fit bg-transparent text-lg font-semibold outline-none"
                  {...field}
                  readOnly={disableEdit}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
