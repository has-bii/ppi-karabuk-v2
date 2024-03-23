import { getKabinets } from "@/utils/kabinet/getKabinet"
import Link from "next/link"

type Props = {}

export default async function Page({}: Props) {
  const data = await getKabinets()

  return (
    <section className="container spacing">
      <h1>Kabinet-Kabinet</h1>
      <div className="flex flex-col gap-4 justify-center items-center mt-12 lg:mt-16 w-full lg:w-32rem">
        {data?.length === 0 ? (
          <div className="text-2xl font-medium">There is no kabinet</div>
        ) : (
          data?.map((kabinet) => (
            <div
              key={kabinet.id}
              className="w-full max-w-[32rem] border-2 border-black p-4 inline-flex gap-8 justify-between items-center"
            >
              <div className="capitalize text-lg font-semibold">
                {kabinet.name +
                  " - " +
                  new Date(kabinet.start_date).getFullYear() +
                  "/" +
                  new Date(kabinet.end_date).getFullYear()}
              </div>
              <Link
                href={`/kabinet/${kabinet.id}`}
                className="px-3 py-1.5 bg-black text-white font-medium"
              >
                Open
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
