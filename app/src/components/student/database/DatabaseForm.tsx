"use client"

import DatabaseFileUpload from "@/components/student/database/DatabaseFileUpload"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import useUserProfileQuery from "@/hooks/user-profile/useUserProfileQuery"
import useSupabaseClient from "@/lib/supabase/supabase-browser"
import { cn } from "@/lib/utils"
import { setFileName } from "@/utils/generateFileName"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { format, setYear } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  birth_place: z.string().min(1, { message: "This field is required" }),
  birth_date: z.date(),
  no_active: z
    .string()
    .trim()
    .min(13, "At least contains 13 digits!")
    .refine((value) => value.startsWith("+"), "Must start with +"),
  no_wa: z
    .string()
    .trim()
    .min(13, "At least contains 13 digits!")
    .refine((value) => value.startsWith("+"), "Must start with +"),
  domisili: z.string(),
  gender: z.enum(["male", "female"]),
  department: z.string(),
  strata: z.enum(["D3", "S1", "S2", "S3", "TOMER"]),
  tahun_kedatangan: z
    .string()
    .min(4, "Invalid year!")
    .refine((value) => !isNaN(parseInt(value))),
  no_student: z.string(),
  no_ikamet: z.string(),
  no_paspor: z.string(),
})

type FileInput = { file: File; src: string } | null

export default function DatabaseForm() {
  const { data: studentDatabase } = useQuery({
    queryKey: ["student-database"],
    queryFn: async () => {
      const { data, error } = await supabase.from("student_database").select("*").single()

      if (error) throw new Error(error.message)

      return data
    },
  })
  const { data: user } = useUserProfileQuery()
  const [studentFile, setStudentFile] = useState<FileInput>(null)
  const [ikametFile, setIkametFile] = useState<FileInput>(null)
  const [pasporFile, setPasporFile] = useState<FileInput>(null)
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name!,
      email: user?.email!,
      birth_place: studentDatabase?.birth_place ? studentDatabase.birth_place : "",
      birth_date: studentDatabase?.birth_date
        ? new Date(studentDatabase.birth_date)
        : setYear(new Date(), 2000),
      no_active: studentDatabase?.no_active ? studentDatabase.no_active : "",
      no_wa: studentDatabase?.no_wa ? studentDatabase.no_wa : "",
      domisili: studentDatabase?.domisili ? studentDatabase.domisili : "",
      gender: studentDatabase?.gender ? studentDatabase.gender : undefined,
      department: studentDatabase?.department ? studentDatabase.department : "",
      strata: studentDatabase?.strata ? studentDatabase.strata : "S1",
      tahun_kedatangan:
        studentDatabase?.tahun_kedatangan.toString() || new Date().getFullYear().toString(),
      no_student: studentDatabase?.no_student ? studentDatabase.no_student : "",
      no_ikamet: studentDatabase?.no_ikamet ? studentDatabase.no_ikamet : "",
      no_paspor: studentDatabase?.no_paspor ? studentDatabase.no_paspor : "",
    },
  })

  const submitHandler = async (formData: z.infer<typeof formSchema>) => {
    let file_student: string | undefined = studentDatabase?.file_student
    let file_ikamet: string | undefined = studentDatabase?.file_ikamet
      ? studentDatabase.file_ikamet
      : undefined

    let file_paspor: string | undefined = studentDatabase?.file_paspor
      ? studentDatabase.file_paspor
      : undefined

    if (studentFile === null && file_student === undefined) {
      toast({ variant: "destructive", description: "Ogrenci Belgesi is required!" })
      return
    }

    if (studentFile) {
      const { data, error } = await supabase.storage
        .from("database")
        .upload(setFileName(studentFile.file.name, user?.id!, "ogrencibelgesi"), studentFile.file, {
          upsert: true,
        })

      if (error) {
        toast({ variant: "destructive", description: error.message })
        return
      }

      file_student = data.path
    }

    if (pasporFile) {
      const { data, error } = await supabase.storage
        .from("database")
        .upload(setFileName(pasporFile.file.name, user?.id!, "pasporfile"), pasporFile.file, {
          upsert: true,
        })

      if (error) {
        toast({ variant: "destructive", description: error.message })
        return
      }

      file_paspor = data.path
    }

    if (ikametFile) {
      const { data, error } = await supabase.storage
        .from("database")
        .upload(setFileName(ikametFile.file.name, user?.id!, "ikametfile"), ikametFile.file, {
          upsert: true,
        })

      if (error) {
        toast({ variant: "destructive", description: error.message })
        return
      }

      file_ikamet = data.path
    }

    const { error } = await supabase
      .from("student_database")
      .upsert({
        name: user?.name!,
        email: user?.email!,
        birth_date: formData.birth_date.toDateString(),
        birth_place: formData.birth_place,
        no_active: formData.no_active,
        no_wa: formData.no_wa,
        gender: formData.gender,
        domisili: formData.domisili,
        department: formData.department,
        strata: formData.strata,
        tahun_kedatangan: parseInt(formData.tahun_kedatangan),
        no_student: formData.no_student,
        no_ikamet: formData.no_ikamet.length === 0 ? undefined : formData.no_ikamet,
        no_paspor: formData.no_paspor.length === 0 ? undefined : formData.no_paspor,
        file_student: file_student as string,
        file_ikamet,
        file_paspor,
      })
      .match({ user_id: user?.id! })

    if (error) toast({ variant: "destructive", description: error.message })
    else toast({ description: "Saved student database successfully" })
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Title */}
      <div className="w-full space-y-2">
        <h3 className="heading-3">Student Info</h3>
        <span className="text-sm text-muted-foreground">
          Your student database can only be seen by you and the admin.
        </span>
        <Separator orientation="horizontal" />
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitHandler)}
          className="flex w-full max-w-[32rem] flex-col gap-4"
        >
          {/* Details */}
          <div className="space-y-4 pt-4">
            <span className="text-xl font-semibold">Details</span>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" type="text" {...field} readOnly />
                  </FormControl>
                  <FormDescription>Only can be changed from settings.</FormDescription>
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
                    <Input placeholder="Bandung" type="text" {...field} readOnly />
                  </FormControl>
                  <FormDescription>Only can be changed from settings.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birth_place"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Tempat Lahir</FormLabel>
                  <FormControl>
                    <Input placeholder="Bandung" type="text" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        fromYear={new Date().getFullYear() - 40}
                        toYear={new Date().getFullYear() - 15}
                        selected={field.value}
                        onSelect={field.onChange}
                        classNames={{
                          caption_label: "hidden",
                          caption_dropdowns: "text-sm font-medium",
                        }}
                        initialFocus
                        required
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="no_active"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Nomor HP</FormLabel>
                  <FormControl>
                    <Input placeholder="+90 552 123 12 34" type="text" {...field} required />
                  </FormControl>
                  <FormDescription>Starts with country code +90/+62</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="no_wa"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Nomor WA</FormLabel>
                  <FormControl>
                    <Input placeholder="+90 552 123 12 34" type="text" {...field} required />
                  </FormControl>
                  <FormDescription>Starts with country code +90/+62</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} required>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="domisili"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Domisili</FormLabel>
                  <FormControl>
                    <Input placeholder="Bandung" type="text" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Education */}
          <div className="space-y-4 pt-4">
            <span className="text-xl font-semibold">Education</span>
            <FormField
              control={form.control}
              name="strata"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strata</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} required>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih strata" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="D3">D3</SelectItem>
                      <SelectItem value="S1">S1</SelectItem>
                      <SelectItem value="S2">S2</SelectItem>
                      <SelectItem value="S3">S3</SelectItem>
                      <SelectItem value="TOMER">TOMER</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Jurusan</FormLabel>
                  <FormControl>
                    <Input placeholder="Halka Iliskiler" type="text" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tahun_kedatangan"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Tahun Kedatangan</FormLabel>
                  <FormControl>
                    <Input placeholder="2019" type="text" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="no_student"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Student Number</FormLabel>
                  <FormControl>
                    <Input placeholder="2010213592" type="text" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DatabaseFileUpload
              id="file_student"
              label="Ogreci Belgesi"
              setFile={setStudentFile}
              isRequired={studentDatabase?.file_student === undefined}
              defaultFile={studentDatabase?.file_student}
            />
          </div>

          {/* Additional */}
          <div className="space-y-4 pt-4">
            <span className="text-xl font-semibold">Additional</span>

            <FormField
              control={form.control}
              name="no_ikamet"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>TC Kimlik</FormLabel>
                  <FormControl>
                    <Input placeholder="9912345678" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="no_paspor"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>No Paspor</FormLabel>
                  <FormControl>
                    <Input placeholder="C12345456" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DatabaseFileUpload
              id="file_ikamet"
              label="File Ikamet"
              setFile={setIkametFile}
              defaultFile={studentDatabase?.file_ikamet!}
            />
            <DatabaseFileUpload
              id="file_paspor"
              label="File Paspor"
              setFile={setPasporFile}
              defaultFile={studentDatabase?.file_paspor!}
            />
          </div>

          {/* Button */}
          <Button type="submit" disabled={form.formState.isSubmitting} className="mt-2 gap-2">
            {form.formState.isSubmitting ? (
              <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
            ) : (
              ""
            )}
            {form.formState.isSubmitting ? "Loading..." : "Save"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
