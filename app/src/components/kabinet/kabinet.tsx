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
import Division from "./divisions/divisions"
import AnggotaDivisi from "./divisions/anggota-divisi"
import useKabinetByIdQuery from "@/hooks/kabinet/byId/useKabinetByIdQuery"
import { Badge } from "../ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import KabinetProker from "./proker-kabinet"
import { UserPosition } from "@/queries/kabinet/getKabinetById"

type Props = {
  id: string
  disableChangeImage?: boolean
  disableEditDivision?: boolean
  disableEditAnggota?: boolean
  disableEditKabinet?: boolean
  path: string
  userPosition?: UserPosition
}

export default function Kabinet({
  id,
  userPosition,
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

        <div className="inline-flex w-full items-center justify-between gap-4">
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
                  <Link className="capitalize" href={path}>
                    {path.replace("/", "")}
                  </Link>
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

          <div className="ml-auto inline-flex items-center gap-2">
            {/* Status visibility */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant={data.isShow ? "default" : "destructive"}>
                    {data.isShow ? "Visible" : "Hidden"}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="left" align="center">
                  <p>
                    {data.isShow
                      ? "This kabinet is visible on the PPI Karabuk website"
                      : "This kabinet can not be seen on the PPI Karabuk website"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Settings */}
            <KabinetSettings
              data={data}
              disableEdit={disableEditKabinet}
              kabinet_id={id}
              userPosition={userPosition}
            />
          </div>
        </div>

        {/* Edit */}
        <div className="flex w-full flex-col gap-8 lg:flex-row">
          {/* Division */}
          <Division kabinetId={id} data={data} disableEdit={disableEditDivision} />

          {/* Proker & Anggota */}
          <Tabs defaultValue="anggota" className="w-full space-y-4 lg:w-3/4">
            <TabsList>
              <TabsTrigger value="proker">Proker</TabsTrigger>
              <TabsTrigger value="anggota">Anggota</TabsTrigger>
            </TabsList>
            <TabsContent value="proker">
              <KabinetProker initialData={data} kabinetId={id} userPosition={userPosition} />
            </TabsContent>
            <TabsContent value="anggota" asChild>
              <AnggotaDivisi
                kabinetId={id}
                initialData={data}
                disableEdit={disableEditAnggota}
                userPosition={userPosition}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )

  if (error) return <div>{error.message}</div>
}
