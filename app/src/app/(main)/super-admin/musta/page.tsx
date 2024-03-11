"use client"

import AddNewMusta from "@/components/super-admin/musta/AddNewMusta"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/context/ToastContext"
import { useSupabaseClient } from "@/hook/supabase"
import { Database } from "@/types/database"
import getDate from "@/utils/getDate"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type MustaData = Database["public"]["Tables"]["musta"]["Row"]

export default function Page() {
  const [mustaData, setMustaData] = useState<MustaData[]>([])
  const supabase = useSupabaseClient()
  const { pushToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    supabase
      .from("musta")
      .select(`*`)
      .then((res) => {
        if (res.error) {
          pushToast("Failed to fetch Data", "error")
          return
        }

        setMustaData(res.data)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-wrap gap-8">
      <AddNewMusta setMustaData={setMustaData} />
      <Card className="w-full lg:w-fit">
        <CardHeader>
          <CardTitle>Musta</CardTitle>
          <CardDescription>You can manage Musyawarah Tahunan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mustaData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">{item.name}</TableCell>
                    <TableCell className="whitespace-nowrap">{getDate(item.created_at)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => router.push("/super-admin/musta/" + item.id)}
                      >
                        Open
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
