import { Pagination } from "@/types/table"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { SetStateAction, useCallback, useEffect } from "react"

type Props = {
  setPagination: (value: SetStateAction<Pagination>) => void
  pagination: Pagination
  data: any[]
}

export default function TablePaginationOutside({ setPagination, pagination, data }: Props) {
  function prevPagination() {
    const check = pagination.start - pagination.row < 0

    setPagination((prev) => ({
      ...prev,
      start: check ? 0 : prev.start - prev.row,
      end: check ? prev.row : prev.end - prev.row,
    }))
  }

  function nextPagination() {
    setPagination((prev) => ({ ...prev, start: prev.start + prev.row, end: prev.end + prev.row }))
  }

  const checkPagination = useCallback((): number => {
    if (pagination.end > data.length) return data.length

    return pagination.end
  }, [pagination.end, data.length])

  const checkNext = useCallback((): boolean => {
    return pagination.end >= data.length
  }, [pagination.end, data.length])

  const checkPrev = useCallback((): boolean => {
    return pagination.start === 0
  }, [pagination.start])

  useEffect(() => {
    setPagination((prev) => ({ ...prev, start: prev.start, end: prev.start + prev.row }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.row])

  if (data.length === 0) return ""

  return (
    <div className="w-full flex flex-row items-center justify-center md:justify-between px-4 mt-4">
      <div className="md:inline-flex hidden">
        <span className="whitespace-nowrap">Show rows per page</span>
        <select
          className="border rounded-md ml-2 p-1"
          onChange={(e) => setPagination((prev) => ({ ...prev, row: parseInt(e.target.value) }))}
          defaultValue={pagination.row}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="25">25</option>
        </select>
      </div>

      <div className="inline-flex gap-6">
        <div className="text-neutral-400">
          <span className="text-neutral-700 font-semibold">{`${
            pagination.start + 1
          }-${checkPagination()}`}</span>
          {` of ${data.length}`}
        </div>
        <button
          className="text-neutral-700 disabled:text-neutral-400"
          onClick={() => prevPagination()}
          disabled={checkPrev()}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <button
          className="text-neutral-700 disabled:text-neutral-400"
          onClick={() => nextPagination()}
          disabled={checkNext()}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
    </div>
  )
}
