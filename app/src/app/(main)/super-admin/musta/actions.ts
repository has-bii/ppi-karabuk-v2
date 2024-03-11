"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Database } from "@/types/database"
import { ResponseWithData } from "@/types/response"

type Data = Database["public"]["Tables"]["musta"]["Row"]

export async function createNewMusta(name: string): Promise<ResponseWithData<Data>> {
  try {
    const supabase = createSupabaseServiceRole()

    const currentYear = new Date().getFullYear()
    const firstDayOfYear = new Date(Date.UTC(currentYear, 0, 1))

    const check = await supabase
      .from("musta")
      .select(`*`, { count: "exact", head: true })
      .gte("created_at", firstDayOfYear.toUTCString())

    if (check.count) {
      return { status: "error", message: "Musta already exists in this year!" }
    }

    const { data, error } = await supabase.from("musta").insert({ name }).select().single()

    if (error) {
      console.error("Failed to create new musta: ", error.message)
      return { status: "error", message: error.message }
    }

    return { status: "success", message: "New Musta has been created", data }
  } catch (error) {
    console.error("Failed to create new Musta: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
