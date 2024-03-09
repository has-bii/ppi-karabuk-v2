import { ILatestNews, NewsDataAttributes } from "@/types"
import getDate from "@/utils/getDate"
import Image from "next/image"
import Link from "next/link"

async function fetchData(): Promise<NewsDataAttributes[]> {
  const res = await fetch(
    `${process.env.BLOG_API}/blogs?populate=*&pagination[pageSize]=8&pagination[page]=1`,
    {
      next: { revalidate: 3600 },
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_BLOG_TOKEN}` },
    }
  )

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data")
  }

  const data: ILatestNews = await res.json()

  return data.data
}

export default async function LatestNews() {
  const data = await fetchData()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {data.map((item, index) => (
        <Link
          href={`/article/${item.attributes.slug}`}
          key={index}
          className="w-full h-fit flex flex-col"
        >
          <div className="w-full h-48 md:h-64 relative">
            <Image
              src={item.attributes.hero.data.attributes.formats.medium.url}
              alt=""
              fill
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover grayscale hover:grayscale-0 transition-all duration-150"
            />
          </div>
          <p className="text-red-400 font-semibold uppercase pt-1">
            {item.attributes.type.data.attributes.name}
          </p>
          <h4 className="text-left line-clamp-1 font-bold">{item.attributes.title}</h4>
          <p className="text-justify text-neutral-400 line-clamp-6">{item.attributes.excerpt}</p>
          <p className="pt-2 text-neutral-400 font-light text-sm">
            {`${getDate(item.attributes.publishedAt)} by `}
            <span className="font-semibold text-black">
              {item.attributes.author.data.attributes.name}
            </span>
          </p>
        </Link>
      ))}
    </div>
  )
}
