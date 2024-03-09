"use client"

import { TypeData } from "@/types/article"
import { useEffect, useRef, useState } from "react"

type Props = {
  data: TypeData[]
  type: string | null
  setType: React.Dispatch<React.SetStateAction<string | null>>
}

export default function Type({ data, type, setType }: Props) {
  const [select, setSelect] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // Clicked outside the dropdown, so close it
        setSelect(false)
      }
    }

    if (select) document.addEventListener("click", handleOutsideClick)

    return () => {
      if (select) document.removeEventListener("click", handleOutsideClick)
    }
  }, [ref, select])

  if (data)
    return (
      <div
        className="bg-black text-white px-4 py-2 relative hover:cursor-pointer capitalize w-full lg:w-fit text-center"
        onClick={() => {
          setSelect(!select)
        }}
      >
        <span>{type ? type : "Type"}</span>
        {select && (
          <div
            ref={ref}
            className="absolute top-14 left-1/2 -translate-x-1/2 border-2 border-black bg-white z-20 text-black flex flex-col divide-y divide-neutral-200 max-h-44 overflow-x-hidden overflow-y-auto"
          >
            {data.map((item, index) => (
              <div
                key={index}
                className={`px-4 py-2 font-semibold whitespace-nowrap ${
                  type === item.attributes.name ? "bg-sky-100" : ""
                }`}
                onClick={() => {
                  setSelect(false)
                  if (type === item.attributes.name) setType(null)
                  else setType(item.attributes.name)
                }}
              >
                {item.attributes.name}
              </div>
            ))}
          </div>
        )}
      </div>
    )
}
