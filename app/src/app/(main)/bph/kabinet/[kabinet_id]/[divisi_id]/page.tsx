"use client"

import useKabinetByIdQuery from "@/hooks/kabinet/byId/useKabinetByIdQuery"
import React from "react"

type Props = {
  params: {
    kabinet_id: string
    divisi_id: string
  }
}

export default function Page({ params: { divisi_id, kabinet_id } }: Props) {
  const { data, error } = useKabinetByIdQuery(kabinet_id)

  if (data) return <pre>{JSON.stringify(data, null, 2)}</pre>
}
