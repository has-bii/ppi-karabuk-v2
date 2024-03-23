import { Divisionuser } from "@/types/kabinet"
import React from "react"
import Anggota from "./Anggota"

type Props = {
  divisionName?: string
  division: {
    name: string
    ketua: Divisionuser | null
    anggota: Divisionuser[]
  } | null
  anggotaPositionName?: string
}

export default function Division({
  division,
  divisionName,
  anggotaPositionName = "anggota",
}: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-left mb-0">{divisionName || division?.name}</h3>
      <div className="flex flex-row gap-4 overflow-x-auto overflow-y-hidden snap-x scrollbar-none">
        {/* Ketua BPH */}
        {division?.ketua ? (
          <Anggota
            name={division.ketua.profiles.name}
            image={division.ketua.profiles.image}
            position="ketua"
          />
        ) : (
          ""
        )}
        {division?.anggota.map((item) => (
          <Anggota
            key={item.id}
            image={item.profiles.image}
            name={item.profiles.name}
            position={anggotaPositionName}
          />
        ))}
      </div>
    </div>
  )
}
