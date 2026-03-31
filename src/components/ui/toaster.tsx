import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import type { Toast } from "@/hooks/use-toast"

let listeners: Array<(t: Toast[]) => void> = []
let store: Toast[] = []

export function addToast(t: Toast) {
  store = [...store, t]
  listeners.forEach((l) => l([...store]))
  setTimeout(() => {
    store = store.filter((x) => x.id !== t.id)
    listeners.forEach((l) => l([...store]))
  }, 4000)
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    listeners.push(setToasts)
    return () => {
      listeners = listeners.filter((l) => l !== setToasts)
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[360px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "rounded-lg border p-4 shadow-lg bg-white flex items-start gap-3 animate-in slide-in-from-bottom-2",
            t.variant === "destructive" && "border-red-200 bg-red-50",
            t.variant === "success" && "border-emerald-200 bg-emerald-50"
          )}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold">{t.title}</p>
            {t.description && <p className="text-sm text-muted-foreground mt-1">{t.description}</p>}
          </div>
          <button
            onClick={() => {
              store = store.filter((x) => x.id !== t.id)
              listeners.forEach((l) => l([...store]))
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
