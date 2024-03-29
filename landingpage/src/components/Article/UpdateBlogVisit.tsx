"use client"

import { useEffect } from "react"

type Props = {
  updateVisited: (id: number) => Promise<void>
  id: number
}

export default function UpdateBlogVisit({ updateVisited, id }: Props) {
  useEffect(() => {
    updateVisited(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ""
}
