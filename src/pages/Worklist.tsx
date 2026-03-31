import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface WorklistProps {
  orders: RadiologyOrder[]
  onClaimOrder: (orderId: string) => void
}

export function Worklist({ orders, onClaimOrder }: WorklistProps) {
  const navigate = useNavigate()
  const [modalityFilter, setModalityFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = orders.filter((o) => {
    if (modalityFilter !== "all" && o.modality !== modalityFilter) return false
    if (priorityFilter !== "all" && o.priority !== priorityFilter) return false
    if (statusFilter !== "all" && o.status !== statusFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Radiologist Worklist</h2>
        <p className="text-sm text-muted-foreground">
          Manage and read imaging studies
        </p>
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 py-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Modality</label>
            <Select value={modalityFilter} onValueChange={setModalityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="CR">X-ray</SelectItem>
                <SelectItem value="CT">CT</SelectItem>
                <SelectItem value="MR">MRI</SelectItem>
                <SelectItem value="US">Ultrasound</SelectItem>
                <SelectItem value="MG">Mammography</SelectItem>
                <SelectItem value="PT">PET</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Priority</label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Routine">Routine</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="STAT">STAT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Ordered">Ordered</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Reported">Reported</SelectItem>
                <SelectItem value="Final">Final</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto text-sm text-muted-foreground pt-5">
            Showing {filtered.length} of {orders.length} studies
          </div>
        </CardContent>
      </Card>

      {/* Worklist Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Studies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Modality</TableHead>
                <TableHead>Body Site</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Radiologist</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <div>
                      {order.patientName}
                      <div className="text-xs text-muted-foreground">{order.patientId}</div>
                    </div>
                  </TableCell>
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
                  <TableCell className="text-muted-foreground">
                    {order.radiologist || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {order.status === "Ordered" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onClaimOrder(order.id)}
                      >
                        Claim
                      </Button>
                    )}
                    {order.status === "In Progress" && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/report/${order.id}`)}
                      >
                        Read
                      </Button>
                    )}
                    {(order.status === "Final" || order.status === "Reported") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/report/${order.id}`)}
                      >
                        View Report
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No studies match the selected filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
