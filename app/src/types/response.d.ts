export type Response = {
  status: "success" | "error"
  message: string
}

export type ResponseWithData<T> =
  | {
      status: "success"
      message: string
      data: T
    }
  | {
      status: "error"
      message: string
    }
