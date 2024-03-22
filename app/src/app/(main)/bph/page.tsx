import { redirect } from "next/navigation"
import { navItems } from "./navitem"

export default async function Page() {
  redirect(navItems[0].href!)
}
