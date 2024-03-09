export type Query = {
  populate: "*"
  pagination: {
    pageSize: number
    page: number
  }
  filters: {
    $and?: (ITitle | ICategory | ITag | IType)[]
  }
}

export type ITitle = {
  title: {
    $containsi: string
  }
}

export type IType = {
  type: {
    name: string
  }
}

export type ICategory = {
  category: {
    name: string
  }
}

export type ITag = {
  tags: {
    name: {
      $in: string[]
    }
  }
}

export type TypeData = {
  id: number
  attributes: {
    name: string
  }
}
