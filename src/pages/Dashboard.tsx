import { useNavigate } from "react-router-dom"
import {
  ClipboardList,
  Clock,
  FileCheck,
  Activity,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type RadiologyOrder } from "@/data/mockData"

const statusBadgeVariant: Record<string, "gray" | "info" | "warning" | "success"> = {
  Ordered: "gray",
  "In Progress": "info",
  Reported: "warning",
  Final: "success",
}

const priorityBadgeVariant: Record<string, "gray" | "warning" | "destructive"> = {
  Routine: "gray",
  Urgent: "warning",
  STAT: "destructive",
}

const summaryCards = [
  { title: "Total Orders", value: "47", icon: ClipboardList, color: "text-primary" },
  { title: "Pending Read", value: "12", icon: Clock, color: "text-amber-600" },
  { title: "Reports Today", value: "8", icon: FileCheck, color: "text-emerald-600" },
  { title: "Avg TAT", value: "18.4 hrs", icon: Activity, color: "text-blue-600" },
]

export function Dashboard({ orders }: { orders: RadiologyOrder[] }) {
  const navigate = useNavigate()
  const recentOrders = [...orders]
    .sort((a, b) => b.orderDate.localeCompare(a.orderDate))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Radiology workflow overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Modality</TableHead>
                <TableHead>Body Site</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.patientName}</TableCell>
                  <TableCell>{order.modalityLabel}</TableCell>
                  <TableCell>{order.bodySite}</TableCell>
                  <TableCell>
                    <Badge variant={priorityBadgeVariant[order.priority]}>
                      {order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant[order.status]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.orderDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button onClick={() => navigate("/new-order")} className="gap-2">
          <ClipboardList className="h-4 w-4" />
          Create New Order
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => navigate("/worklist")} className="gap-2">
          <FileCheck className="h-4 w-4" />
          Open Worklist
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
