import { useState, useCallback } from "react"

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
}

let toastListeners: Array<(toasts: Toast[]) => void> = []
let toastStore: Toast[] = []

function notify() {
  toastListeners.forEach((l) => l([...toastStore]))
}

export function toast({ title, description, variant = "default" }: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2)
  const t: Toast = { id, title, description, variant }
  toastStore = [...toastStore, t]
  notify()
  setTimeout(() => {
    toastStore = toastStore.filter((x) => x.id !== id)
    notify()
  }, 4000)
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(toastStore)

  const subscribe = useCallback(() => {
    toastListeners.push(setToasts)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToasts)
    }
  }, [])

  useState(() => {
    const unsub = subscribe()
    return unsub
  })

  return { toasts, toast }
}
