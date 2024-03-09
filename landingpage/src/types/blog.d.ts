export interface ResBlog {
  data: Blog[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface Blog {
  id: number
  attributes: {
    title: string
    slug: string
    excerpt: string
    content: BlogContent[]
    createdAt: string
    updatedAt: string
    publishedAt: string
    visited: string | null
    hero: {
      data: {
        id: number
        attributes: HeroAttributes
      }
    }
    type: BlogType
    category: BlogCategory
    tags: {
      data: BlogTag[]
    }
    author: Author
    editor: Editor
  }
}

type BlogContent =
  | {
      type: "heading"
      level: 1 | 2 | 3 | 4 | 5 | 6
      children: childrenType[]
    }
  | {
      type: "paragraph"
      children: childrenType[]
    }
  | {
      type: "image"
      image: {
        ext: ".jpg"
        url: string
        hash: string
        mime: "image/jpeg"
        name: string
        size: number
        width: number
        height: number
        caption: null | string
        provider: "local"
        createdAt: string
        updatedAt: string
        previewUrl: null | string
        alternativeText: string
        provider_metadata: null
        formats: {
          larger: ImageFormat
          small: ImageFormat
          medium: ImageFormat
          thumbnail: ImageFormat
        }
      }
      children: childrenType[]
    }
  | {
      type: "quote"
      children: childrenType[]
    }
  | {
      type: "list"
      format: "ordered" | "unordered"
      children: { type: "list-item"; children: childrenType[] }[]
    }

type childrenType =
  | {
      text: string
      type: "text"
      bold?: true
      italic?: true
      underline?: true
      strikethrough?: true
    }
  | {
      url: string
      type: "link"
      children: {
        text: string
        type: "text"
        bold?: true
        italic?: true
        underline?: true
        strikethrough?: true
      }[]
    }

interface BlogContentItem {
  text: string
  type: ContentType
  children?: BlogContentItem[]
}

interface HeroAttributes {
  name: string
  alternativeText: string | null
  caption: string | null
  width: number
  height: number
  formats: {
    large: ImageFormat
    small: ImageFormat
    medium: ImageFormat
    thumbnail: ImageFormat
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  provider_metadata: any | null
  createdAt: string
  updatedAt: string
}

interface ImageFormat {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: string | null
  size: number
  width: number
  height: number
}

interface BlogTag {
  id: number
  attributes: {
    name: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

interface Author {
  data: {
    id: number
    attributes: {
      name?: string
      instagram?: string
      avatar?: string
      createdAt: string
      updatedAt: string
    }
  }
}

interface Editor {
  data: {
    id: number
    attributes: {
      name?: string
      instagram?: string
      avatar?: string
      createdAt: string
      updatedAt: string
    }
  }
}

type BlogType = {
  data: {
    id: number
    attributes: {
      name: string
      createdAt: string
      updatedAt: string
      publishedAt: string
    }
  }
}

type BlogCategory = {
  data: {
    id: number
    attributes: {
      name: string
      createdAt: string
      updatedAt: string
      publishedAt: string
    }
  }
}
