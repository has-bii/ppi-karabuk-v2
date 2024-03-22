import { createSupabaseServiceRole } from "@/lib/supabase/server"

export const revalidate = 0

export async function GET(request: Request) {
  try {
    const supabase = createSupabaseServiceRole()

    const { data, error } = await supabase
      .from("kabinet")
      .select("*,division(*,division_user(*,profiles(name,image)))")

    if (error) Response.json({ ok: false, data: null, message: error.message })

    data?.forEach((kabinet) => {
      kabinet.division.forEach((divisi) => {
        divisi.division_user.map((user) => {
          if (user.profiles?.image)
            user.profiles.image = supabase.storage
              .from("profiles")
              .getPublicUrl(user.profiles.image).data.publicUrl
        })
      })
    })

    return Response.json({ ok: true, data, message: "Fetched all kabinets!" })
  } catch (error) {
    return Response.json({ ok: false, data: null, message: "Internal server error!" })
  }
}
