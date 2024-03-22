import path from "path"
import crypto from "crypto"

export default function generateFileName(originalFileName: string) {
  const fileExtension = path.extname(originalFileName)
  const randomString = crypto.randomBytes(10).toString("hex")
  const uniqueFileName = randomString + fileExtension

  return uniqueFileName
}

export function setFileName(originalFileName: string, userId: string, fileName: string) {
  const fileExtension = path.extname(originalFileName)
  return userId + "/" + fileName + fileExtension
}
