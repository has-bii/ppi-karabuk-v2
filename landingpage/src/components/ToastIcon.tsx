import { faCircleCheck, faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type ToastStatus = "danger" | "error" | "normal" | "success"

type Props = {
    status: ToastStatus
}

const getColor = (status: ToastStatus) => {
    if (status === "success") return "text-green-500"

    if (status === "normal") return "text-sky-500"

    if (status === "danger") return "text-yellow-500"

    if (status === "error") return "text-red-500"
}

export default function ToastIcon({ status }: Props) {
    return (
        <FontAwesomeIcon
            icon={status === "success" ? faCircleCheck : faExclamationCircle}
            className={getColor(status)}
            size="lg"
        />
    )
}
