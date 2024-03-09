import PopularNews from "@/components/Article/PopularNews"
import { ILatestNews, NewsDataAttributes } from "@/types"
import getDate from "@/utils/getDate"
import Image from "next/image"
import Link from "next/link"
import qs from "qs"
import QueryingArticles from "@/components/Article/QueryingArticles"
import { ICategory, ITag, ITitle, IType, Query } from "@/types/article"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Article | PPI Karabuk",
}

type TypeParams = {
  pTags: string[]
  pType: string | null
  pCategory: string | null
  pTitle: string | null
}

interface TypeData {
  id: number
  attributes: {
    name: string
  }
}

// Fetching functions
async function fetchTypesData(): Promise<TypeData[]> {
  try {
    const res = await fetch(`${process.env.BLOG_API}/types`, {
      next: { revalidate: 3600 },
      headers: {
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_BLOG_TOKEN,
      },
    })

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data")
    }

    const data: { data: TypeData[] } = await res.json()

    return data.data
  } catch (error) {
    return []
  }
}

async function fetchCategoriesData(): Promise<TypeData[]> {
  try {
    const res = await fetch(`${process.env.BLOG_API}/categories`, {
      next: { revalidate: 3600 },
      headers: {
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_BLOG_TOKEN,
      },
    })

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data")
    }

    const data: { data: TypeData[] } = await res.json()

    return data.data
  } catch (error) {
    return []
  }
}

async function fetchTagsData(): Promise<TypeData[]> {
  try {
    const res = await fetch(`${process.env.BLOG_API}/tags`, {
      next: { revalidate: 3600 },
      headers: {
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_BLOG_TOKEN,
      },
    })

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data")
    }

    const data: { data: TypeData[] } = await res.json()

    return data.data
  } catch (error) {
    return []
  }
}

async function fetchNews({
  pCategory,
  pTags,
  pType,
  pTitle,
}: TypeParams): Promise<NewsDataAttributes[]> {
  try {
    const query: Query = {
      populate: "*",
      pagination: {
        pageSize: 10,
        page: 1,
      },
      filters: {
        $and: [],
      },
    }

    addQuery(query, { pCategory, pTags, pType, pTitle })

    const res = await fetch(
      `${process.env.BLOG_API}/blogs?${qs.stringify(query, { encodeValuesOnly: true })}`,
      {
        cache: "no-cache",
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

// Utils
function getParams(searchParams: { [key: string]: string | string[] | undefined }): TypeParams {
  const t = searchParams["tag"] ?? []
  const ty = searchParams["type"] ?? []
  const c = searchParams["category"] ?? []
  const tl = searchParams["title"] ?? []

  const pTags: string[] = typeof t === "string" ? [t] : t
  const pType: string | null = typeof ty === "string" ? ty : ty.length === 0 ? null : ty[0]
  const pCategory: string | null = typeof c === "string" ? c : c.length === 0 ? null : c[0]
  const pTitle: string | null = typeof tl === "string" ? tl : tl.length === 0 ? null : tl[0]

  return { pTags, pType, pCategory, pTitle }
}

function addQuery(query: Query, { pType, pCategory, pTags, pTitle }: TypeParams) {
  const and: (ITitle | ICategory | ITag | IType)[] = []

  if (pTitle) and.push({ title: { $containsi: pTitle } })

  if (pType) and.push({ type: { name: pType } })

  if (pCategory) and.push({ category: { name: pCategory } })

  if (pTags.length > 0) and.push({ tags: { name: { $in: pTags } } })

  if (and.length > 0) query.filters.$and = and
}

// Main Component
export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { pCategory, pTags, pType, pTitle } = getParams(searchParams)

  const data = await fetchNews({ pCategory, pTags, pType, pTitle })
  const dataTypes = await fetchTypesData()
  const dataCategories = await fetchCategoriesData()
  const dataTags = await fetchTagsData()

  return (
    <section className="container spacing">
      <h1>Pojok Tulisan</h1>
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="w-full lg:w-3/4">
          {/* Filtering articles start */}
          <QueryingArticles
            dataCategories={dataCategories}
            dataTypes={dataTypes}
            dataTags={dataTags}
            pCategory={pCategory}
            pTags={pTags}
            pType={pType}
            pTitle={pTitle}
          />
          {/* Filtering articles end */}

          {/* Main */}
          <div className="flex flex-col mt-4 divide-y">
            {data.length === 0 ? (
              <div className="w-full h-28 flex justify-center items-center">
                There is no article.
              </div>
            ) : (
              data.map((item, index) => (
                <div key={index} className="flex flex-col lg:flex-row gap-4 py-4">
                  <Link
                    href={"/article/" + item.attributes.slug}
                    className="aspect-video h-48 relative"
                  >
                    <Image
                      src={item.attributes.hero.data.attributes.formats.medium.url}
                      alt=""
                      fill
                      quality={100}
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <p className="text-neutral-400 font-light text-sm">
                      <span className="text-red-400 font-semibold uppercase">
                        {item.attributes.type.data.attributes.name}
                      </span>
                      {` - ${getDate(item.attributes.publishedAt)}`}
                    </p>
                    <Link href={"/article/" + item.attributes.slug}>
                      <h4 className="line-clamp-2 hover:underline">{item.attributes.title}</h4>
                    </Link>
                    <p className="text-left line-clamp-4 text-neutral-400">
                      {item.attributes.excerpt}
                    </p>
                    <p className="text-neutral-400 font-light text-sm mt-auto">
                      {`by `}
                      <Link
                        href={`https://www.instagram.com/${item.attributes.author.data.attributes.instagram}/`}
                        target="_blank"
                        className="font-semibold text-black"
                      >
                        {item.attributes.author.data.attributes.name}
                      </Link>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Main end */}
        </div>
        <div className="w-full lg:w-1/4">
          <h3 className="text-left mb-4">Popular Articles</h3>
          <div className="flex flex-col gap-2">
            <PopularNews />
          </div>
        </div>
      </div>
    </section>
  )
}
