import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs"
import generateFileName from "./generateFileName"

export default async function saveFile(
  dirFile: string,
  file: File,
  currentPathFile?: string
): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  if (!existsSync("public" + dirFile)) mkdirSync("public" + dirFile)

  const path = `${dirFile}/${generateFileName(file.name)}`

  writeFileSync("public" + path, buffer)

  if (currentPathFile) {
    if (existsSync("public" + currentPathFile)) unlinkSync("public" + currentPathFile)
  }

  return path
}
