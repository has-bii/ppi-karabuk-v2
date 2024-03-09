"use server"

import prisma from "@/lib/prisma"
import generateFileName from "@/utils/generateFileName"
import { changeSession, getSession } from "@/utils/auth/session"
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs"

export type UpdateImageProfileResponse = {
  status: "success" | "error"
  message: string
}

export default async function updateImageProfile(
  formData: FormData
): Promise<UpdateImageProfileResponse> {
  try {
    const user = await getSession()

    if (!user) return { status: "error", message: "User doesn't exist!" }

    const file = formData.get("image") as File

    if (!file.type.startsWith("image")) return { status: "error", message: "Invalid image type!" }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (!existsSync("public/profiles")) mkdirSync("public/profiles")

    const path = "/profiles/" + generateFileName(file.name)

    writeFileSync("public" + path, buffer)

    if (user.image && existsSync("public" + user.image)) unlinkSync("public" + user.image)

    const updated = await prisma.user.update({ where: { id: user.id }, data: { image: path } })

    changeSession(user, "image", updated.image)

    return { status: "success", message: "Profile image has been updated" }
  } catch (error) {
    console.log("Failed to update User Profile Image: ", error)
    return { status: "error", message: "Failed to update profile image" }
  }
}
