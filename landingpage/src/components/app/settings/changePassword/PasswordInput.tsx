import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { SetStateAction, useState } from "react"

type Props = {
  id: string
  label: string
  validation?: string
  value: string
  placeholder: string
  setValue: (value: SetStateAction<string>) => void
}

export default function PasswordInput({
  id,
  setValue,
  value,
  label,
  validation,
  placeholder,
}: Props) {
  const [show, setShow] = useState<boolean>(false)

  return (
    <div>
      <label htmlFor={id} className="capitalize text-neutral-400">
        {label}
      </label>
      <div className="inline-flex justify-between items-center gap-4 w-full border rounded-md px-3 py-1.5 mt-1">
        <input
          type={show ? "text" : "password"}
          id={id}
          name={id}
          className="block text-lg w-full placeholder:text-neutral-200"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />

        <FontAwesomeIcon
          icon={show ? faEye : faEyeSlash}
          className="hover:cursor-pointer"
          onClick={() => setShow(!show)}
        />
      </div>
      <span className="text-sm capitalize text-red-400">{validation}</span>
    </div>
  )
}
