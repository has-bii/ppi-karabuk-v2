"use client"

import React, { ReactNode, useCallback, useEffect, useState } from "react"
import { ToastData, ToastStatus } from "@/types/toast"
import { ToastContext } from "@/context/ToastContext"
import Toast from "@/components/Toast"
import { v1 as uuidv1 } from "uuid"

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleTimeout = useCallback(() => {
    if (toasts.length > 0) {
      const newToasts = toasts.slice(1)
      setToasts(newToasts)
    }
  }, [toasts])

  const pushToast = useCallback((message: string, status: ToastStatus) => {
    const id = uuidv1()
    setToasts((prevToasts) => [...prevToasts, { message, status, id }])
  }, [])

  const deleteToast = useCallback((toast: ToastData) => {
    setToasts((prevToasts) => prevToasts.filter((item) => item.id !== toast.id))
  }, [])

  useEffect(() => {
    if (toasts.length > 0 && !timeoutId) {
      const id = setTimeout(handleTimeout, 2000)
      setTimeoutId(id)
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        setTimeoutId(null)
      }
    }
  }, [toasts, timeoutId, handleTimeout])

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {toasts.length > 0 && <Toast toasts={toasts} delToast={deleteToast} />}
      {children}
    </ToastContext.Provider>
  )
}
