import { redirect } from "next/navigation"

type Props = {}

export default async function Page({}: Props) {

  redirect('/student/musta')
}
