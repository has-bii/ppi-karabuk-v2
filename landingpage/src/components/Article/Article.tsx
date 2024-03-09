"use client"

import { Blog } from "@/types/blog"
import getDate from "@/utils/getDate"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect } from "react"
import RenderContent from "./RenderContent"

type Props = {
  data: Blog
  updateVisited: (id: number) => Promise<void>
}

export default function Article({ data, updateVisited }: Props) {
  useEffect(() => {
    updateVisited(data.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="container px-0 spacing text-center">
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
