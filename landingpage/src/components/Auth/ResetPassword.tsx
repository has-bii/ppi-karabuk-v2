"use client"

import { faArrowRightToBracket, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import resetPassword from "@/service/auth/resetPassword"
import { useToast } from "@/context/ToastContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthInput } from "@/types/auth"
import Input from "./Input"

export default function ResetPassword({ token }: { token: string }) {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { pushToast } = useToast()
  const [password, setPassword] = useState<AuthInput>({
    label: "password",
    value: "",
    validation: { status: null, text: "" },
  })
  const [confirm, setConfirm] = useState<AuthInput>({
    label: "confirm",
    value: "",
    validation: { status: null, text: "" },
  })

  async function submitHandler(formData: FormData) {
    setLoading(true)

    const res = await resetPassword(formData)

    pushToast(res.message, res.status)

    if (res.status === "success") router.push("/auth")
  }

  useEffect(() => {
    if (password.value.length < 8) {
      setPassword((prev) => ({
        ...prev,
        validation: { status: "error", text: "at least password contains 8 characters" },
      }))
    } else
      setPassword((prev) => ({
        ...prev,
        validation: { status: "ok", text: "" },
      }))
  }, [password.value])

  useEffect(() => {
    if (confirm.value.length)
      if (confirm.value !== password.value) {
        setConfirm((prev) => ({
          ...prev,
          validation: { status: "error", text: "Passwords did not match!" },
        }))
      } else
        setConfirm((prev) => ({
          ...prev,
          validation: { status: "ok", text: "" },
        }))
  }, [confirm.value, password.value])

  return (
    <form action={submitHandler} className="auth-card">
      <p className="header">Forgot password?</p>
      <p className="description mb-4">No worries, we&apos;ll send you reset code.</p>
      <input type="text" name="token" value={token} className="hidden" readOnly />
      <Input state={password} type="password" setState={setPassword} required />
      <Input state={confirm} type="password" setState={setConfirm} required />
      <button
        type="submit"
        className="button w-full mt-2 font-semibold inline-flex gap-2 justify-center items-center"
        disabled={
          loading || password.validation.status === "error" || confirm.validation.status === "error"
        }
      >
        <FontAwesomeIcon
          icon={loading ? faCircleNotch : faArrowRightToBracket}
          className={loading ? "animate-spin" : ""}
        />
        change password
      </button>
    </form>
  )
}
