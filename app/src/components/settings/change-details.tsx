import React, { useEffect } from "react"
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
import { useToast } from "../ui/use-toast"
import useUserProfileUpdate from "@/hooks/user-profile/useUserProfileUpdate"
import { useQueryClient } from "@tanstack/react-query"
import { Profile } from "@/types/model"

const formSchema = z.object({
  name: z.string().min(6, { message: "At least contains 6 characters!" }),
  email: z.string().email({ message: "Invalid email!" }),
})

type Props = {
  name: string | undefined | null
  email: string | undefined
  userId: string | undefined
}

export default function ChangeDetails({ name, email, userId }: Props) {
  const queryClient = useQueryClient()
  const updateProfile = useUserProfileUpdate()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name || "",
      email: email,
    },
  })

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    await updateProfile.mutateAsync(
      { name: formData.name.toLowerCase(), id: userId, email: formData.email },
      {
        onSuccess: () => {
          toast({ description: "Updated name successfully" })

          queryClient.setQueryData(["user-profile"], (prev: Profile) => ({
            ...prev,
            name: formData.name.toLowerCase(),
          }))
        },
        onError: (error) => {
          toast({ description: error.message, variant: "destructive" })
        },
      }
    )
  }

  return (
    <Card className="w-full lg:w-fit">
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
      </CardContent>
    </Card>
  )
}
