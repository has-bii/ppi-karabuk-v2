import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSupabaseClient } from "@/hook/supabase"
import { useToast } from "@/context/ToastContext"

const formSchema = z.object({
  name: z.string().min(6, { message: "At least contains 6 characters!" }),
  email: z.string().email({ message: "Invalid email!" }),
})

type Props = {
  userId: string
  name: string
  email: string
}

export default function ChangeDetails({ name, email, userId }: Props) {
  const supabase = useSupabaseClient()
  const { pushToast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      email: email,
    },
    values: {
      email,
      name,
    },
  })

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    const { error } = await supabase
      .from("user")
      .update({ name: formData.name.toLowerCase() })
      .eq("id", userId)

    if (error) pushToast(error.message, "error")
    else pushToast("Changed name successfully", "success")
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Edit Details</CardTitle>
        <CardDescription>
          Can change name only. Change email will be the next feature.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email address"
                      type="email"
                      readOnly
                      className="bg-accent"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Change email is not available yet.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="inline-flex gap-2 items-center mt-2"
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
      </CardContent>
    </Card>
  )
}
