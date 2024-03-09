"use client"

import { faCircleXmark, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Category from "./Category"
import { useEffect, useRef, useState } from "react"
import Tags from "./Tags"
import Type from "./Type"
import { useRouter } from "next/navigation"

interface TypeData {
  id: number
  attributes: {
    name: string
  }
}

type Props = {
  dataTypes: TypeData[]
  dataCategories: TypeData[]
  dataTags: TypeData[]
  pTags: string[]
  pType: string | null
  pCategory: string | null
  pTitle: string | null
}

export default function QueryingArticles({
  dataCategories,
  dataTags,
  dataTypes,
  pCategory,
  pTags,
  pType,
  pTitle,
}: Props) {
  const [category, setCategory] = useState<string | null>(pCategory)
  const [TO, setTO] = useState<NodeJS.Timeout | null>(null)
  const [title, setTitle] = useState<string>(pTitle ?? "")
  const [type, setType] = useState<string | null>(pType)
  const [tags, setTags] = useState<string[]>(pTags)
  const firstR = useRef<boolean>(false)
  const router = useRouter()

  function fetchNews() {
    const params: string[] = [...tags.map((tag) => `tag=${tag}`)]

    if (type) params.push(`type=${type}`)

    if (category) params.push(`category=${category}`)

    if (title.length > 0) params.push(`title=${title}`)

    router.push(`/article?${params.join("&")}`)
  }

  useEffect(() => {
    if (firstR.current) {
      if (TO) clearTimeout(TO)

      setTO(
        setTimeout(() => {
          fetchNews()
        }, 1500)
      )
    } else firstR.current = true

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, type, tags])

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 w-full">
        <div className="inline-flex w-full gap-4 justify-between bg-white border-2 border-[#000] px-4 py-2">
          <input
            type="text"
            placeholder="Cari tulisan"
            className="w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchNews()
              }
            }}
          />
          <button onClick={() => fetchNews()}>
            <FontAwesomeIcon icon={faSearch} size="xl" />
          </button>
        </div>
        <div className="inline-flex gap-2">
          <Type data={dataTypes} type={type} setType={setType} />
          <Category data={dataCategories} category={category} setCategory={setCategory} />
          <Tags data={dataTags} tags={tags} setTags={setTags} />
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 ? (
        <div className="w-fit flex-wrap inline-flex items-center gap-1 pt-2">
          <div className="font-bold text-black uppercase h-fit">tags :</div>
          {tags.map((item, index) => (
            <div
              key={index}
              className="px-2 py-1 bg-neutral-300 text-neutral-600 text-sm hover:cursor-pointer inline-flex gap-1 items-center"
              onClick={() => {
                if (tags.some((i) => i === item)) setTags(tags.filter((name) => name !== item))
                else setTags((prev) => [...prev, item])
              }}
            >
              #{item}
              <FontAwesomeIcon icon={faCircleXmark} size="1x" className="text-neutral-400" />
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
      {/* Tags end */}
    </>
  )
}
