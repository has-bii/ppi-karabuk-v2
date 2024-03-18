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
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"
import useSupabaseClient from "@/lib/supabase/supabase-browser"
import { Response } from "@/types/response"

const RegisterSchema = z.object({
  name: z.string().min(6, "At least contains 6 characters"),
  email: z.string().email(),
  password: z.string().min(6, "At least contains 6 characters"),
})

export default function Page() {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  const onSubmit = async (formData: z.infer<typeof RegisterSchema>) => {
    toast({ description: "Signing up..." })

    const res = await fetch("/auth/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData }),
    })

    const data = (await res.json()) as Response

    toast({
      description: data.message,
      variant: data.status === "error" ? "destructive" : "default",
    })

    if (data.status === "success") router.push("/auth")
  }

  return (
    <div className="flex min-w-96 flex-col gap-2 px-4 lg:px-0">
      <h1 className="text-2xl font-semibold text-foreground">
        Register to Official Platform of
        <br />
        PPI Karabuk!
      </h1>
      <span className="text-sm font-light text-muted-foreground">
        Already have an account?&nbsp;
        <Link href="/auth" className="font-medium text-foreground underline">
          Sign in
        </Link>
      </span>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 flex flex-col gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1">
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
          <span className="block text-left text-sm text-muted-foreground">
            Forgot password?{" "}
            <Link href={"/auth/forgot"} className="text-sm font-medium text-foreground underline">
              Reset password
            </Link>
          </span>
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
            {form.formState.isSubmitting ? "Loading..." : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
