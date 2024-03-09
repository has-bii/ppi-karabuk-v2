import { ActivationRequestStatus } from "@prisma/client"

type Props = {
  status: ActivationRequestStatus
}

export default function RenderStatus({ status }: Props) {
  function state(status: ActivationRequestStatus): string | undefined {
    if (status === "APPROVED") return "text-green-400 bg-green-50 border-green-400"
    if (status === "PENDING") return "text-yellow-400 bg-yellow-50 border-yellow-400"
    if (status === "REJECTED") return "text-red-400 bg-red-50 border-red-400"
  }

  return (
    <span className={`rounded-full border text-sm px-3 py-1 tracking-wide ${state(status)}`}>
      {status}
    </span>
  )
}
