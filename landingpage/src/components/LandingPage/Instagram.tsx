import "@/styles/alice-carousel.css"
import { InstagramData } from "@/types"
import InstagramCarousel from "./InstagramCarousel"

async function fetchData(): Promise<InstagramData[]> {
  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=10&access_token=${process.env.LONG_LIVED_TOKEN}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data")
    }

    const data = await res.json()

    return data.data
  } catch (error) {
    console.error("Failed to fetch Instagram feeds: ", error)

    return []
  }
}

export default async function Instagram() {
  const data: InstagramData[] = await fetchData()

  return (
    <div className="container px-0 lg:px-4 relative">
      <InstagramCarousel data={data} />
    </div>
  )
}
