"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Database } from "@/types/database"
import { ResponseWithData } from "@/types/response"
import { unstable_cache } from "next/cache"

type Data = Database["public"]["Tables"]["student_database"]["Row"][]

const getStudentDatabases = unstable_cache(
  async (): Promise<ResponseWithData<Data>> => {
    try {
      const supabase = createSupabaseServiceRole()

      const { data, error } = await supabase
        .from("student_database")
        .select("*")
        .order("name", { ascending: true })

      if (error) return { status: "error", message: error.message }

      return { status: "success", data, message: "" }
    } catch (error) {
      return { status: "error", message: "Internal server error" }
    }
  },
  ["student-databases"],
  {
    tags: ["student-databases"],
  }
)

export default getStudentDatabases
