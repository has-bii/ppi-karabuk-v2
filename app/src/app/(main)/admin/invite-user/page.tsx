"use client"

import { useCallback } from "react"
import { actionInvitesUsers } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { useToast } from "@/components/ui/use-toast"
import { Role } from "@/types/enum"

type Inputs = { id: Role; label: string }

const roles: Inputs[] = [
  {
    id: "STUDENT",
    label: "Student",
  },
  {
    id: "BPH",
    label: "BPH",
  },
  {
    id: "ADMIN",
    label: "Admin",
  },
]

const formSchema = z.object({
  roles: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one role!",
  }),
  name: z.string().min(6, "At least contains 6 characters!"),
  email: z.string().email({ message: "Invalid email!" }),
})

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      roles: ["STUDENT"],
      email: "",
    },
  })

  const { toast } = useToast()

  const submitHandler = useCallback(async (formData: z.infer<typeof formSchema>) => {
    const res = await actionInvitesUsers({
      name: formData.name.toLowerCase(),
      email: formData.email.toLowerCase(),
      roles: formData.roles as Role[],
    })
    toast({ variant: res.status === "error" ? "destructive" : "default", description: res.message })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card className="w-full lg:w-fit">
      <CardHeader>
        <CardTitle>Invite Users</CardTitle>
        <CardDescription>You can invite users and give them some roles directly.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4 space-y-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4 space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {roles.map((item) => (
              <FormField
                key={item.id}
                control={form.control}
                name="roles"
                render={({ field }) => (
                  <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item.id])
                            : field.onChange(field.value?.filter((value) => value !== item.id))
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{item.label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
            <div className="inline-flex w-full">
              <Button className="ml-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                )}
                {form.formState.isSubmitting ? "Inviting..." : "Invite"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
