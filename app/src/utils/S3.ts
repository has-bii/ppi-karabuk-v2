import createSupabaseClient from "@/lib/supabase/client"
import { TypedSupabaseClient } from "@/lib/supabase/types"
import { Buckets } from "@/types/bucket"

export function getImageFromS3(path: string, bucket: Buckets) {
  return process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/" + bucket + "/" + path
}

export async function openFileS3(path: string, bucket: Buckets) {
  const supabase = createSupabaseClient()

  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60)

  if (data?.signedUrl) window.open(data.signedUrl, "_blank")
}

export function openPublicFile(path: string, bucket: Buckets, supabase: TypedSupabaseClient) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  return data.publicUrl
}
