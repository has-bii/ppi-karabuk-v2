import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import ToastIcon from "@/components/ToastIcon"

type ToastStatus = "danger" | "error" | "normal" | "success"

type ToastData = {
  id: string
  message: string
  status: ToastStatus
}

type Props = {
  toasts: ToastData[]
  delToast: (toast: ToastData) => void
}

export default function Toast({ toasts, delToast }: Props) {
  return (
    <div className="toast-container">
      {toasts.map((toast, id) => (
        <div key={id} className={`toast-item ${toast.status}`}>
          <ToastIcon status={toast.status} />

          <p>{toast.message}</p>

          <button className="ml-auto" onClick={() => delToast(toast)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      ))}
    </div>
  )
}
