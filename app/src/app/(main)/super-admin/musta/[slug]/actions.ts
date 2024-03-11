"use server"

import { createSupabaseServiceRole } from "@/lib/supabase/server"
import { Database } from "@/types/database"
import { Response, ResponseWithData } from "@/types/response"
import { revalidatePath } from "next/cache"

type Data = Database["public"]["Tables"]["musta_vote"]["Row"]

export async function createNewVote(
  musta_id: string,
  name: string
): Promise<ResponseWithData<Data>> {
  try {
    const supabase = createSupabaseServiceRole()

    const { data, error } = await supabase
      .from("musta_vote")
      .insert({ musta_id, name })
      .select()
      .single()

    if (error) {
      console.error("Failed to create new vote: ", error.message)
      return { status: "error", message: error.message }
    }

    revalidatePath("/super-admin/musta/" + musta_id)

    return { status: "success", message: "New vote has been created", data: data }
  } catch (error) {
    console.error("Failed to create new vote: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}

export async function deleteVote(id: string, musta_id: string): Promise<Response> {
  try {
    const supabase = createSupabaseServiceRole()

    const { error } = await supabase.from("musta_vote").delete().eq("id", id)

    if (error) {
      console.error("Failed to delete vote: ", error.message)
      return { status: "error", message: error.message }
    }

    revalidatePath("/super-admin/musta/" + musta_id)

    return { status: "success", message: "Vote has been deleted" }
  } catch (error) {
    console.error("Failed to create delete vote: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}

export async function fetchAllUsers(): Promise<
  ResponseWithData<Database["public"]["Tables"]["user"]["Row"][]>
> {
  try {
    const supabase = createSupabaseServiceRole()

    const { error, data } = await supabase.from("user").select().order("name", { ascending: true })

    if (error) {
      console.error("Failed to fetch users: ", error.message)
      return { status: "error", message: error.message }
    }

    return { status: "success", message: "ok", data }
  } catch (error) {
    console.error("Failed to fetch users: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}

export type Candidates = {
  created_at: string
  id: string
  musta_vote_id: string
  user_id: string
  user: {
    name: string | null
  } | null
}

export async function fetchCandidates(
  musta_vote_id: string
): Promise<ResponseWithData<Candidates[]>> {
  try {
    const supabase = createSupabaseServiceRole()

    const { error, data } = await supabase
      .from("musta_vote_register_candidate")
      .select(`*,user(name)`)
      .eq("musta_vote_id", musta_vote_id)

    if (error || !data) {
      console.error("Failed to fetch candidates: ", error.message)
      return { status: "error", message: error.message }
    }

    return { status: "success", message: "ok", data }
  } catch (error) {
    console.error("Failed to fetch candidates: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}

export type AddCandidateData = {
  created_at: string
  id: string
  musta_vote_id: string
  user_id: string
  user: {
    name: string | null
  } | null
}

export async function addCandidate(
  user_id: string,
  musta_vote_id: string
): Promise<ResponseWithData<AddCandidateData>> {
  try {
    const supabase = createSupabaseServiceRole()

    const check = await supabase
      .from("musta_vote_register_candidate")
      .select(`*`, { count: "exact", head: true })
      .eq("user_id", user_id)
      .eq("musta_vote_id", musta_vote_id)

    if (check.count) {
      return { status: "error", message: "Candidate has already registered to the voting!" }
    }

    const { error, data } = await supabase
      .from("musta_vote_register_candidate")
      .insert({ musta_vote_id, user_id })
      .select(`*,user(name)`)
      .single()

    if (error) {
      console.error("Failed to add candidate: ", error.message)
      return { status: "error", message: error.message }
    }

    return { status: "success", message: "ok", data }
  } catch (error) {
    console.error("Failed to add candidate: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}

export async function deleteCandidate(candidate_id: string): Promise<Response> {
  try {
    const supabase = createSupabaseServiceRole()

    const { error } = await supabase
      .from("musta_vote_register_candidate")
      .delete()
      .eq("id", candidate_id)

    if (error) {
      console.error("Failed to delete candidate: ", error.message)
      return { status: "error", message: error.message }
    }

    return { status: "success", message: "ok" }
  } catch (error) {
    console.error("Failed to delete candidate: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
