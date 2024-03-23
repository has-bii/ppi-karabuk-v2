import { Kabinet } from "@/types/kabinet"

export async function getKabinets() {
  try {
    const res = await fetch(`${process.env.APP_URL}/api/kabinet`, {
      next: {
        tags: ["kabinet"],
        revalidate: 3600,
      },
    })

    if (res.ok) return (await res.json()).data as Kabinet[]
    else return null
  } catch (error) {
    console.error("Failed to fetch kabinet: ", error)
    return null
  }
}

export async function getKabinetById(id: string) {
  try {
    const res = await fetch(`${process.env.APP_URL}/api/kabinet`, {
      next: {
        tags: ["kabinet", id],
        revalidate: 3600,
      },
    })

    if (res.ok) {
      const { data } = (await res.json()) as { data: Kabinet[] }

      return data.find((kabinet) => kabinet.id === id) || null
    } else return null
  } catch (error) {
    console.error("Failed to fetch kabinet: ", error)
    return null
  }
}
