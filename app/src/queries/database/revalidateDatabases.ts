"use server"

import { revalidateTag } from "next/cache"

export default async function revalidateDatabases() {
  revalidateTag("student-databases")
}
