import RenderContent from "@/components/Article/RenderContent"
import UpdateBlogVisit from "@/components/Article/UpdateBlogVisit"
import { axiosBlog, axiosBlogUpdate } from "@/lib/axiosBlog"
import { Blog, ResBlog } from "@/types/blog"
import getDate from "@/utils/getDate"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import qs from "qs"

export const revalidate = 3600 // revalidate the data at most every hour

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug)

  if (data === undefined)
    return (
      <section className="container my-auto">
        <h1>Article not found!</h1>
      </section>
    )
  else {
    return (
      <section className="container px-0 spacing text-center">
        <UpdateBlogVisit updateVisited={updateBlogVisited} id={data.id} />
        <p className="text-sm uppercase font-semibold text-neutral-400 mb-4">
          <Link
            href={`/article?category=${data.attributes.category.data.attributes.name}`}
            className="text-red-400"
          >
            {data.attributes.category.data.attributes.name}
          </Link>
          {` | `}
          <span>{getDate(data.attributes.publishedAt)}</span>
        </p>
        <h2>{data.attributes.title}</h2>

        <div className="relative aspect-video mb-6">
          <Image
            src={data.attributes.hero.data.attributes.formats.large.url}
            alt=""
            fill
            quality={100}
            priority
            className="object-cover"
            sizes="(max-width: 768px) 33vw, 100vw"
          />
        </div>

        <div className="w-full px-4 md:px-0 md:w-[768px] mx-auto text-justify text-neutral-600">
          <RenderContent contents={data.attributes.content} />

          <p className="text-left font-semibold capitalize">
            Author:&nbsp;
            <Link
              href={`https://www.instagram.com/${data.attributes.author.data.attributes.instagram}`}
              target="_blank"
              className="text-red-400"
            >
              {data.attributes.author.data.attributes.name}
            </Link>
          </p>
          <p className="text-left font-semibold capitalize">
            Editor:&nbsp;
            <Link
              href={`https://www.instagram.com/${data.attributes.editor.data.attributes.instagram}`}
              target="_blank"
              className="text-red-400"
            >
              {data.attributes.editor.data.attributes.name}
            </Link>
          </p>

          <p className="text-xl font-semibold capitalize mt-6 mb-1">tags</p>
          <div className="flex flex-wrap gap-2">
            {data.attributes.tags.data.map((item, index) => (
              <Link
                href={`/article?tag=${item.attributes.name}`}
                key={index}
                className="px-4 py-2 bg-neutral-200 text-sm"
              >
                #{item.attributes.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }
}

async function updateBlogVisited(id: number) {
  "use server"
  try {
    const res = await axiosBlog.get<ResBlog>(`/blogs?filter[id]=${id}`)

    if (res.status === 200) {
      const data = res.data.data[0]

      const visited = data.attributes.visited

      axiosBlogUpdate.put("/blogs/" + id, {
        data: {
          visited: visited ? (parseInt(visited) + 1).toString() : "1",
        },
      })
    }
  } catch (error) {}
}

async function getData(slug: string): Promise<Blog | undefined> {
  const query = qs.stringify(
    {
      populate: "*",
      pagination: {
        pageSize: 1,
      },
      filters: {
        slug: {
          $eq: slug,
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  )

  const res = await fetch(`${process.env.BLOG_API}/blogs?${query}`, {
    cache: "force-cache",
    headers: { Authorization: "Bearer " + process.env.NEXT_PUBLIC_BLOG_TOKEN },
  })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data")
  }

  const data: ResBlog = await res.json()

  if (data.data.length === 0) return undefined

  return data.data[0]
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const data = await getData(params.slug)

  return {
    title: data?.attributes.title,
    description: data?.attributes.excerpt,
    authors: [
      {
        name: data?.attributes.author.data.attributes.name,
        url: `https://www.instagram.com/${data?.attributes.author.data.attributes.instagram}`,
      },
    ],
    openGraph: {
      title: data?.attributes.title,
      type: "article",
      url: "www.ppi-karabuk.com",
      description: data?.attributes.excerpt,
      images: data?.attributes.hero.data.attributes.formats.thumbnail.url,
      authors: data?.attributes.author.data.attributes.name,
      publishedTime: data?.attributes.publishedAt,
    },
    robots: {
      index: true,
      follow: true,
      noimageindex: false,
      notranslate: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    category: data?.attributes.category.data.attributes.name,
  }
}
