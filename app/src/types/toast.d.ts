export type ToastStatus = "danger" | "error" | "normal" | "success"

export type TToastContext = {
  pushToast: (message: string, status: ToastStatus) => void
}

export type ToastData = {
  id: string
  message: string
  status: ToastStatus
}
