"use client"

import { Button } from "../ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { useToast } from "../ui/use-toast"
import useSupabaseClient from "@/lib/supabase/supabase-browser"

const formSchema = z
  .object({
    new_password: z.string().min(6, { message: "At least contains 6 characters!" }),
    confirm_password: z.string().min(6, { message: "At least contains 6 characters!" }),
  })
  .refine((data) => data.new_password === data.new_password, {
    message: "Passwords must match!",
    path: ["confirm_password"],
  })

export default function ChangePassword() {
  const supabase = useSupabaseClient()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirm_password: "",
      new_password: "",
    },
  })

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    const { error } = await supabase.auth.updateUser({ password: formData.new_password })

    if (error) toast({ variant: "destructive", description: error.message })
    else toast({ description: "Changed password successfully" })
  }

  return (
    <Card className="w-full lg:w-fit">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>You must add your password if you were invited.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="New password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Confirm</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm password" type="password" {...field} />
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
              {form.formState.isSubmitting ? "Loading..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
