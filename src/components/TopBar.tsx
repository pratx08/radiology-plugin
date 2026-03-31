import { User } from "lucide-react"

export function TopBar() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-primary">
          CARE Radiology Plugin
        </h1>
        <span className="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
          Prototype
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
          <User className="h-4 w-4" />
        </div>
        <span className="font-medium text-foreground">Dr. Prathyaksh Nilson</span>
      </div>
    </header>
  )
}
