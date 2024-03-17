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

const ForgotSchema = z.object({
  email: z.string().email(),
})

export default function Page() {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof ForgotSchema>>({
    resolver: zodResolver(ForgotSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (formData: z.infer<typeof ForgotSchema>) => {
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email.toLowerCase())

    if (error) {
      toast({ description: error.message, title: "Forgot password", variant: "destructive" })
      return
    }

    toast({ description: "Reset link email has been sent" })
    router.push("/auth")
  }

  return (
    <div className="flex min-w-96 flex-col gap-2 px-4 lg:px-0">
      <h1 className="text-2xl font-semibold text-foreground">Forgot your password?</h1>
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
            {form.formState.isSubmitting ? "Loading..." : "Forgot"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
