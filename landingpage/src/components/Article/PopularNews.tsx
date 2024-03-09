import { ILatestNews, NewsDataAttributes } from "@/types"
import getDate from "@/utils/getDate"
import Image from "next/image"
import Link from "next/link"

async function fetchData(): Promise<NewsDataAttributes[]> {
  try {
    const res = await fetch(
      `${process.env.BLOG_API}/blogs?populate=*&pagination[pageSize]=3&pagination[page]=1&sort=visited:desc`,
      {
        next: { revalidate: 3600 },
        headers: {
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_BLOG_TOKEN,
        },
      }
    )

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data")
    }

    const data: ILatestNews = await res.json()

    return data.data
  } catch (error) {
    return []
  }
}

export default async function PopularNews() {
  const data = await fetchData()

  return (
    <>
      {data.map((item, index) => (
        <Link
          href={`/article/${item.attributes.slug}`}
          key={index}
          className="w-full h-fit flex flex-col"
        >
          <div className="w-full h-48 relative">
            <Image
              src={item.attributes.hero.data.attributes.formats.medium.url}
              alt=""
              fill
              quality={100}
              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
          <p className="text-neutral-400 font-light pt-2 text-sm">
            <span className="text-red-400 font-semibold uppercase">
              {item.attributes.type.data.attributes.name}
            </span>
            {` - ${getDate(item.attributes.publishedAt)} by `}
            <span className="font-semibold text-black ">
              {item.attributes.author.data.attributes.name?.split(" ")[0]}
            </span>
          </p>
          <h4 className="text-left line-clamp-4 font-bold">{item.attributes.title}</h4>
        </Link>
      ))}
    </>
  )
}
