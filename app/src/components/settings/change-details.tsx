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
import { useToast } from "@/components/ui/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { Profile } from "@/types/model"
import { updateUserProfile } from "@/utils/user-profile/updateUserProfile"
import { useCallback } from "react"

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
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name || "",
      email: email,
    },
  })

  const onSubmit = useCallback(
    async (formData: z.infer<typeof formSchema>) => {
      const { message, status } = await updateUserProfile(userId!, { name: formData.name })

      toast({ description: message, variant: status === "error" ? "destructive" : "default" })

      if (status === "success") {
        queryClient.setQueryData(["user-profile"], (prev: Profile) => ({
          ...prev,
          name: formData.name.toLowerCase(),
        }))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId]
  )

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
