"use client"

import React, { FormEvent } from "react"
import { Button } from "../ui/button"
import { useSupabaseClient } from "@/hook/supabase"
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
import { useToast } from "@/context/ToastContext"

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
  const { pushToast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirm_password: "",
      new_password: "",
    },
  })

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    const { error } = await supabase.auth.updateUser({ password: formData.new_password })

    if (error) pushToast(error.message, "error")
    else pushToast("Changed password successfully", "success")
  }

  return (
    <Card className="h-fit">
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
              className="inline-flex gap-2 items-center mt-2"
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
