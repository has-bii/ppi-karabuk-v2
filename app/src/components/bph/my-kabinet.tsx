"use client"

import useMyKabinetQuery from "@/hooks/mykabinet/useMyKabinet"
import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export const fetchCache = "force-cache"

export default function MyKabinet() {
  const { data, error } = useMyKabinetQuery()

  if (error || !data)
    return <h2 className="heading-2">{error?.message || "Internal server error!"}</h2>

  return (
    <div className="flex flex-wrap gap-4">
      {data.map((kabinet) => (
        <Card key={kabinet.kabinet?.id} className="w-full sm:w-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{kabinet.kabinet?.name}</CardTitle>
            <CardDescription>Click open to see your kabinet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={"/bph/kabinet/" + kabinet.kabinet?.id}
              className={buttonVariants({ className: "mt-3 w-full" })}
            >
              Open
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
