import { BlogContent, childrenType } from "@/types/blog"
import Image from "next/image"
import Link from "next/link"

type Props = {
  contents: BlogContent[]
}

export default function RenderContent({ contents }: Props) {
  return contents.map((item, index) => {
    // Heading
    if (item.type === "heading")
      return (
        <p key={index} className={`heading-${item.level}`}>
          <RenderChildren child={item.children} index={index} />
        </p>
      )

    // Paragraph
    if (item.type === "paragraph")
      return (
        <p key={index} className="mb-4">
          <RenderChildren child={item.children} index={index} />
        </p>
      )

    // List
    if (item.type === "list")
      if (item.format === "ordered") {
        return (
          <ol key={index} className="list-decimal list-inside mb-3">
            {item.children.map((child, childKey) => {
              if (child.type === "list-item")
                return (
                  <li key={childKey}>
                    <RenderChildren child={child.children} index={index} />
                  </li>
                )
            })}
          </ol>
        )
      } else
        return (
          <ul key={index} className="list-disc list-inside mb-3">
            {item.children.map((child, childKey) => {
              if (child.type === "list-item")
                return (
                  <li key={childKey}>
                    <RenderChildren child={child.children} index={index} />
                  </li>
                )
            })}
          </ul>
        )

    // Image
    if (item.type === "image")
      return (
        <Image
          key={index}
          src={item.image.url}
          alt={item.image.caption || ""}
          height={item.image.formats.medium.height}
          width={item.image.formats.medium.width}
          className="content-image mb-4"
        />
      )

    // Quote
    if (item.type === "quote")
      return (
        <p key={index} className="mb-4 quote">
          <RenderChildren child={item.children} index={index} />
        </p>
      )
  })
}

function RenderChildren({ child, index }: { index: number; child: childrenType[] }) {
  return child.map((i, indexText) => {
    if (i.type === "text")
      return (
        <span key={index + "_" + indexText} className={getClassName(i)}>
          {i.text}
        </span>
      )
    if (i.type === "link")
      return i.children.map((childLink, indexLink) => (
        <Link
          href={i.url}
          key={index + "_" + indexLink}
          className={`text-sky-400 ${getClassName(childLink)}`}
        >
          {childLink.text}
        </Link>
      ))
  })
}

function getClassName(i: childrenType): string {
  if (i.type === "text") {
    const _class: string[] = []

    if (i.bold) _class.push("font-semibold")

    if (i.italic) _class.push("italic")

    if (i.strikethrough) _class.push("line-through")

    if (i.underline) _class.push("underline")

    return _class.join(" ")
  }

  return ""
}
