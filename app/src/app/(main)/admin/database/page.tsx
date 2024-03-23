import TableStudentDatabase from "@/components/student/databases/TableStudentDatabase"
import getStudentDatabases from "@/queries/database/getStudentDatabases"
import React from "react"

type Props = {}

export default async function Page({}: Props) {
  const res = await getStudentDatabases()

  if (res.status === "error") return <h3 className="heading-h3 mt-4">{res.message}</h3>

  return <TableStudentDatabase dataProp={res.data} />
}
