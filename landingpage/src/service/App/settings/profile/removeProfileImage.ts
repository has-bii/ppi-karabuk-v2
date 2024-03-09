"use server"

import prisma from "@/lib/prisma"
import { changeSession, getSession } from "@/utils/auth/session"
import { existsSync, unlinkSync } from "fs"

export type UpdateImageProfileResponse = {
  status: "success" | "error"
  message: string
}

export default async function removeProfileImage(): Promise<UpdateImageProfileResponse> {
  try {
    const user = await getSession()

    if (!user) return { status: "error", message: "User doesn't exist!" }

    if (user.image && existsSync("public" + user.image)) unlinkSync("public" + user.image)

    const updated = await prisma.user.update({ where: { id: user.id }, data: { image: null } })

    changeSession(user, "image", updated.image)

    return { status: "success", message: "Profile image has been removed" }
  } catch (error) {
    console.log("Failed to remove User Profile Image: ", error)
    return { status: "error", message: "Failed to remove profile image" }
  }
}
