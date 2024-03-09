/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"

type Props = {
  setData: React.Dispatch<React.SetStateAction<Data>>
  dataProp: Data
  func?: (name: string) => void
}

type Data = any[]

export default function SearchByName({ dataProp, setData, func }: Props) {
  const [valueName, setValueName] = useState<string>("")

  useEffect(() => {
    if (valueName.length === 0) setData(dataProp)
    else if (func) func(valueName)
    else setData(dataProp.filter((item) => (item.name as string).includes(valueName)))
  }, [valueName])

  return (
    <form
      className="flex flex-row gap-2 mb-2 w-fit"
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <input
        value={valueName}
        onChange={(e) => setValueName(e.target.value)}
        type="text"
        className="px-3 py-1.5 border rounded-lg w-3/4"
        placeholder="Search name..."
      />
      <button type="submit" className="px-3 py-1.5 bg-black text-white rounded-lg w-1/4">
        Search
      </button>
    </form>
  )
}
