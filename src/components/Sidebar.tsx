import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  FilePlus,
  List,
  BarChart3,
  UserSearch,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/new-order", icon: FilePlus, label: "New Order" },
  { to: "/worklist", icon: List, label: "Worklist" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/patient", icon: UserSearch, label: "Patient Lookup" },
  { to: "/abdm", icon: ShieldCheck, label: "ABDM Compliance" },
]

export function Sidebar() {
  return (
    <aside className="flex w-56 flex-col border-r bg-white">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">
          C
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">CARE</p>
          <p className="text-[10px] text-muted-foreground leading-none">ohc.network</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary"
                  : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t p-3">
        <p className="text-[10px] text-muted-foreground text-center">
          GSoC 2026 Prototype
        </p>
      </div>
    </aside>
  )
}
