"use client"

import { useForm } from "react-hook-form"
import Link from "next/link"
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
import { Button } from "@/components/ui/button"
import { useSupabaseClient } from "@/hook/supabase"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "At least contains 6 characters"),
})

export default function Page() {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (formData: z.infer<typeof LoginSchema>) => {
    toast({ description: "Signing in..." })

    const { error } = await supabase.auth.signInWithPassword({ ...formData })

    if (error) {
      if (error?.message === "Invalid login credentials") {
        form.setError("email", {
          message: error.message,
          type: "server",
        })
        form.setError("password", {
          message: error.message,
          type: "server",
        })
      }

      toast({ description: error.message })
      return
    }

    toast({ description: "Authenticated" })
    router.refresh()
  }

  return (
    <div className="flex min-w-96 flex-col gap-2 px-4 lg:px-0">
      <h1 className="text-2xl font-semibold text-foreground">
        Welcome to PPI Karabuk,
        <br />
        Official Platform!
      </h1>
      <span className="text-sm font-light text-muted-foreground">
        Don&apos;t have an account?&nbsp;
        <Link href="/auth/register" className="font-medium text-foreground underline">
          Sign up
        </Link>
      </span>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 flex flex-col gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="inline-flex items-center gap-2"
          >
            {form.formState.isSubmitting ? (
              <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
            ) : (
              ""
            )}
            {form.formState.isSubmitting ? "Loading..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
