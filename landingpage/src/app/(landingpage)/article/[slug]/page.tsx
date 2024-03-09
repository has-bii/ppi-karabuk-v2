import Article from "@/components/Article/Article"
import { axiosBlog, axiosBlogUpdate } from "@/lib/axiosBlog"
import { Blog, ResBlog } from "@/types/blog"
import { Metadata } from "next"
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
    return <Article data={data} updateVisited={updateBlogVisited} />
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
    title: "Article | PPI Karabuk",
    metadataBase: new URL(process.env.BASE_URL || "http://localhost:3000/"),
    description: data?.attributes.excerpt,
    openGraph: {
      title: data?.attributes.title,
      url: "www.ppi-karabuk.com",
      description: data?.attributes.excerpt,
      images: `${process.env.NEXT_PUBLIC_BLOG_API}${data?.attributes.hero.data.attributes.formats.thumbnail.url}`,
    },
  }
}
