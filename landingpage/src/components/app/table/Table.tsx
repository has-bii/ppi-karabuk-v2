import { Pagination } from "@/types/table"
import { ReactNode, useState } from "react"
import TablePaginationOutside from "../TablePaginationOutside"

type Props = {
  dataProp: any[]
  children: ReactNode
  columns: string[]
}

export default function TableComponent({ dataProp, columns, children }: Props) {
  const [pagination, setPagination] = useState<Pagination>({ start: 0, end: 10, row: 10 })
  return (
    <div className="bg-white border rounded-lg overflow-hidden max-w-full">
      <div className="overflow-x-auto">
        <div>
          <table className="table-auto text-left rtl:text-right text-gray-500 w-full">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th key={column} scope="col" className="px-6 py-3 whitespace-nowrap">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">{children}</tbody>
          </table>
        </div>
      </div>
      <div className="px-6 py-3 border-t">
        <TablePaginationOutside
          data={dataProp}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  )
}
