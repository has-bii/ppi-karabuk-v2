"use client"
import KabinetImage from "./image-kabinet"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import Link from "next/link"
import KabinetSettings from "./settings-kabinet"
import Division from "./division/division"
import AnggotaDivisi from "./division/anggota-divisi"
import useKabinetByIdQuery from "@/hooks/kabinet/byId/useKabinetByIdQuery"
import { Badge } from "../ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Database } from "@/types/database"

type Props = {
  id: string
  disableChangeImage?: boolean
  disableEditDivision?: boolean
  disableEditAnggota?: boolean
  disableEditKabinet?: boolean
  path: string
  position?: {
    name: Database["public"]["Tables"]["division"]["Row"]["name"]
    type: Database["public"]["Tables"]["division"]["Row"]["type"]
  }
}

export default function Kabinet({
  id,
  position,
  path,
  disableChangeImage = false,
  disableEditDivision = false,
  disableEditAnggota = false,
  disableEditKabinet = false,
}: Props) {
  const { data, error } = useKabinetByIdQuery(id)

  if (data)
    return (
      <div className="space-y-4">
        <KabinetImage id={id} data={data} disableChange={disableChangeImage} />

        <div className="inline-flex w-full items-center justify-between">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={path}>Admin</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={path + "/kabinet"}>Kabinet</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">{data.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Settings */}
          <KabinetSettings data={data} disableEdit={disableEditKabinet} />
        </div>

        {/* Edit */}
        <div className="flex w-full flex-col gap-8 lg:flex-row">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant={data.isShow ? "default" : "destructive"}>
                      {data.isShow ? "Visible" : "Hidden"}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center">
                    <p>
                      {data.isShow
                        ? "This kabinet is visible in the PPI Karabuk website"
                        : "This kabinet can not be seen in the PPI Karabuk website"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Division kabinetId={id} data={data} disableEdit={disableEditDivision} />
          </div>
          <AnggotaDivisi
            kabinetId={id}
            initialData={data}
            disableEdit={disableEditAnggota}
            position={position}
          />
        </div>
      </div>
    )

  if (error) return <div>{error.message}</div>
}
