import { getKabinetById } from "@/utils/kabinet/getKabinet"
import { getDivisions, getMainDivision } from "@/utils/kabinet/getMainDivision"
import Image from "next/image"
import Division from "@/components/kabinet/Division"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"

type Props = {
  params: { id: string }
}

export default async function Page({ params: { id } }: Props) {
  const data = await getKabinetById(id)

  if (!data) return <h1>Kabinet not found!</h1>

  const divisiKetua = getMainDivision("ketua", data.division)
  const divisiMPA = getMainDivision("MPA", data.division)
  const divisiSekre = getMainDivision("sekretaris", data.division)
  const divisiBendahara = getMainDivision("bendahara", data.division)

  const divisions = getDivisions(data.division)

  return (
    <div className="">
      {/* <div className="relative w-full h-96 bg-black">
        <Image alt={data.name} src={data.} fill quality={100} sizes="33vw" />
      </div> */}
      <div className="container mt-4">
        <div className="inline-flex gap-4 items-center text-neutral-400">
          <Link href="/">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} size="sm" />
          <Link href="/kabinet">Kabinet</Link>
          <FontAwesomeIcon icon={faChevronRight} size="sm" />
          <span className="text-black font-medium">{data.name}</span>
        </div>
      </div>
      <div className="container spacing">
        <h1>{`Kabinet ` + data.name}</h1>
        <div className="space-y-8">
          {divisiKetua?.anggota.length !== 0 && (
            <Division
              division={divisiKetua}
              divisionName="Ketua BPH"
              anggotaPositionName="Wakil Anggota"
            />
          )}
          {divisiMPA?.anggota.length !== 0 && <Division division={divisiMPA} />}
          {divisiSekre?.anggota.length !== 0 && <Division division={divisiSekre} />}
          {divisiBendahara?.anggota.length !== 0 && <Division division={divisiBendahara} />}
          {divisions.map((divisi) => (
            <Division key={divisi.name} division={divisi} />
          ))}
        </div>
      </div>
    </div>
  )
}
