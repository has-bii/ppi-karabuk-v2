import createSupabaseClient from "@/lib/supabase/client"
import { Buckets } from "@/types/bucket"

export function getImageFromS3(path: string, bucket: Buckets) {
  return process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/" + bucket + "/" + path
}

export async function openFileS3(path: string, bucket: Buckets) {
  const supabase = createSupabaseClient()

  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60)

  if (data?.signedUrl) window.open(data.signedUrl, "_blank")
}
