"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useGetSignUpSettings from "@/hooks/signup-settings/useGetSignupSettings"
import { boolean, z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect } from "react"
import { Role } from "@/types/enum"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Switch } from "../ui/switch"
import { Checkbox } from "../ui/checkbox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { useToast } from "../ui/use-toast"
import saveSettings from "@/utils/signup-settings/save-settings"
import { useQueryClient } from "@tanstack/react-query"

const formSchema = z.object({
  signup_is_enabled: z.boolean(),
  signup_default_status: z.boolean(),
  signup_default_role: z.array(z.enum(["STUDENT", "BPH", "ADMIN"])),
})

const roles: Role[] = ["ADMIN", "BPH", "STUDENT"]

export default function SignUpSettings() {
  const queryClient = useQueryClient()
  const { data } = useGetSignUpSettings()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      signup_is_enabled: (
        data?.find((item) => item.setting === "signup_is_enabled")?.value as { boolean: boolean }
      )?.boolean,
      signup_default_role: (
        data?.find((item) => item.setting === "signup_default_role")?.value as { array: Role[] }
      )?.array,
      signup_default_status: (
        data?.find((item) => item.setting === "signup_default_status")?.value as {
          boolean: boolean
        }
      )?.boolean,
    },
  })

  const submitHandler = useCallback(async (formData: z.infer<typeof formSchema>) => {
    const res = await saveSettings({
      ...formData,
    })

    toast({
      variant: res.status === "error" ? "destructive" : "default",
      description: res.message,
    })

    if (res.status === "success") {
      queryClient.setQueryData(["signup-settings"], () => [
        {
          setting: "signup_default_role",
          value: {
            array: formData.signup_default_role,
          },
        },
        {
          setting: "signup_is_enabled",
          value: {
            boolean: formData.signup_is_enabled,
          },
        },
        {
          setting: "signup_default_status",
          value: {
            boolean: formData.signup_default_status,
          },
        },
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (data)
    return (
      <Card className="w-full lg:max-w-96">
        <CardHeader>
          <CardTitle>Sign Up Settings</CardTitle>
          <CardDescription>Set default settings when a user signs up.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submitHandler)} className="w-full space-y-6">
              <div>
                <div className="space-y-4">
                  {/* signup_is_enabled */}
                  <FormField
                    control={form.control}
                    name="signup_is_enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Enable user signs up</FormLabel>
                          <FormDescription>When enabled, a user can sign up.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* signup_is_enabled */}
                  <FormField
                    control={form.control}
                    name="signup_default_status"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Default user status</FormLabel>
                          <FormDescription>
                            When enabled, user status will be active.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* signup_default_role */}
                  <FormField
                    control={form.control}
                    name="signup_default_role"
                    render={() => (
                      <FormItem className="rounded-lg border p-3 shadow-sm">
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            Default role when a user signs up
                          </FormLabel>
                          <FormDescription>Select the roles to be default roles.</FormDescription>
                        </div>
                        {roles.map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="signup_default_role"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item])
                                          : field.onChange(
                                              field.value?.filter((value) => value !== item)
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">{item}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                ) : (
                  "Save preferences"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    )
}
