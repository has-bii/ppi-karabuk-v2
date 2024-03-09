export type InstagramData = {
  id: string
  caption: string
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  media_url: string
  thumbnail_url: string
  permalink: string
}

// Latest News

interface NewsChild {
  text: string
  type: "text"
}

interface NewsContent {
  type: "paragraph"
  children: NewsChild[]
}

interface NewsHero {
  data: {
    id: number
    attributes: {
      name: string
      alternativeText: null | string
      caption: null | string
      width: number
      height: number
      formats: {
        large: {
          ext: string
          url: string
          hash: string
          mime: string
          name: string
          path: null | string
          size: number
          width: number
          height: number
        }
        small: {
          ext: string
          url: string
          hash: string
          mime: string
          name: string
          path: null | string
          size: number
          width: number
          height: number
        }
        medium: {
          ext: string
          url: string
          hash: string
          mime: string
          name: string
          path: null | string
          size: number
          width: number
          height: number
        }
        thumbnail: {
          ext: string
          url: string
          hash: string
          mime: string
          name: string
          path: null | string
          size: number
          width: number
          height: number
        }
      }
      hash: string
      ext: string
      mime: string
      size: number
      url: string
      previewUrl: null | string
      provider: string
      provider_metadata: null | string
      createdAt: string
      updatedAt: string
    }
  }
}

interface NewsTag {
  id: number
  attributes: {
    name: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

interface NewsDataAttributes {
  id: number
  attributes: {
    title: string
    slug: string
    excerpt: string
    content: NewsContent[]
    createdAt: string
    updatedAt: string
    publishedAt: string
    visited: null | string
    hero: NewsHero
    type: {
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
    category: {
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
    tags: {
      data: NewsTag[]
    }
    author: {
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
    editor: {
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
  }
}

interface NewsMeta {
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

interface NewsItem {
  id: number
  attributes: NewsDataAttributes
}

export interface ILatestNews {
  data: NewsDataAttributes[]
  meta: NewsMeta
}
