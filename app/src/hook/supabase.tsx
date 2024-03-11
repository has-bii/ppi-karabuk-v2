import createSupabaseClient from "@/lib/supabase/client"
import { useMemo } from "react"

export const useSupabaseClient = () => useMemo(createSupabaseClient, [])
