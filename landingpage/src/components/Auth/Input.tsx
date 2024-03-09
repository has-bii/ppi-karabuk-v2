"use client"

import { AuthInput } from "@/types/auth"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"

interface InputProps {
  state: AuthInput
  className?: string
  type?: "text" | "password" | "email"
  required?: boolean
  setState: Dispatch<SetStateAction<AuthInput>>
}

const Input: React.FC<InputProps> = ({
  state,
  type = "text",
  required,
  className = "",
  setState,
}) => {
  const [show, setShow] = useState<boolean>(false)
  const [focus, setFocus] = useState<boolean>(state.value.length > 0)

  const resetValidation = useCallback(() => {
    setState((prev) => ({ ...prev, validation: { status: null, text: "" } }))
  }, [setState])

  useEffect(() => {
    resetValidation()
  }, [resetValidation, state.value])

  const handleFocus = () => setFocus(true)
  const handleBlur = () => setFocus(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, value: e.target.value }))
  }

  return (
    <div className={`flex flex-col gap-1 mb-4 ${className}`}>
      <div className="relative inline-flex justify-between items-center w-full border-2 border-black px-4 py-3 gap-2 bg-white">
        <label
          htmlFor={state.label}
          className={`capitalize transition-all duration-150 ease-in-out font-semibold bg-white absolute -translate-y-1/2 px-1 py-0.5 ${
            focus || state.value ? "top-0 left-2" : "top-1/2 left-2"
          }`}
        >
          {state.label}
        </label>
        <input
          id={state.label}
          name={state.label}
          type={ChangeType(type, show)}
          className="w-full text-gray-500"
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={state.value}
          onChange={handleChange}
          required={required}
        />
        {type === "password" && <ShowHidePasswordIcon show={show} setShow={setShow} />}
      </div>
      {state.validation.status !== null && (
        <span
          className={`px-2 text-sm ${
            state.validation.status === "error" ? "text-red-400" : "text-green-400"
          }`}
        >
          {state.validation.text}
        </span>
      )}
    </div>
  )
}

interface ShowHidePasswordIconProps {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
}

const ShowHidePasswordIcon: React.FC<ShowHidePasswordIconProps> = ({ show, setShow }) => (
  <FontAwesomeIcon
    icon={show ? faEye : faEyeSlash}
    size="1x"
    className="hover:cursor-pointer"
    onClick={() => setShow((prev) => !prev)}
  />
)

function ChangeType(
  type: "text" | "password" | "email",
  show: boolean
): "text" | "password" | "email" {
  return type === "password" ? (show ? "text" : "password") : type
}

export default Input
