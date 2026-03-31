import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileImage,
  Scan,
  Radio,
  MonitorSmartphone,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react"
import { ananyaImagingHistory, type RadiologyOrder } from "@/data/mockData"

const statusBadgeVariant: Record<string, "gray" | "info" | "warning" | "success"> = {
  Ordered: "gray",
  "In Progress": "info",
  Reported: "warning",
  Final: "success",
}

const modalityIcons: Record<string, typeof FileImage> = {
  CR: FileImage,
  CT: Scan,
  MR: Radio,
  US: MonitorSmartphone,
  MG: FileImage,
  PT: Scan,
}

function ImagingCard({ order }: { order: RadiologyOrder }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = modalityIcons[order.modality] || FileImage

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">
                {order.modalityLabel} — {order.bodySite}
                {order.laterality !== "N/A" ? ` (${order.laterality})` : ""}
              </p>
              <p className="text-sm text-muted-foreground">{order.orderDate}</p>
              {order.radiologist && (
                <p className="text-xs text-muted-foreground mt-1">
                  Reported by: {order.radiologist}
                </p>
              )}
              {order.status === "Final" && order.impression && (
                <p className="text-sm mt-2 text-foreground italic">
                  "{order.impression}"
                </p>
              )}
              {order.status === "Ordered" && (
                <p className="text-sm mt-2 text-muted-foreground">
                  Awaiting imaging — no report available yet
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusBadgeVariant[order.status]}>{order.status}</Badge>
            {order.status === "Final" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {expanded ? "Collapse" : "View Full Report"}
              </Button>
            )}
          </div>
        </div>

        {expanded && order.status === "Final" && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Findings
              </p>
              <p className="text-sm mt-1">{order.findings}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Conclusion
              </p>
              <p className="text-sm mt-1">
                {order.conclusion}{" "}
                {order.conclusionCode && (
                  <span className="text-muted-foreground">({order.conclusionCode})</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Impression
              </p>
              <p className="text-sm mt-1">{order.impression}</p>
            </div>
            <Separator />
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function PatientHistory() {
  const history = ananyaImagingHistory

  return (
    <div className="space-y-6">
      {/* Tab bar simulating CARE patient detail */}
      <Tabs defaultValue="imaging">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview" disabled className="opacity-60">
            Overview
          </TabsTrigger>
          <TabsTrigger value="encounters" disabled className="opacity-60">
            Encounters
          </TabsTrigger>
          <TabsTrigger value="medications" disabled className="opacity-60">
            Medications
          </TabsTrigger>
          <TabsTrigger value="lab" disabled className="opacity-60">
            Lab Results
          </TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
          <TabsTrigger value="documents" disabled className="opacity-60">
            Documents
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Patient Header */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Ananya Sharma</h2>
              <p className="text-sm text-muted-foreground">
                45F | CARE-2024-0312 | Facility: District Hospital Ernakulam
              </p>
            </div>
            <Badge variant="info">{history.length} imaging records</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Imaging Timeline */}
      <div>
        <CardHeader className="px-0">
          <CardTitle className="text-lg">Imaging History</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {history
            .sort((a, b) => b.orderDate.localeCompare(a.orderDate))
            .map((order) => (
              <ImagingCard key={order.id} order={order} />
            ))}
        </div>
      </div>
    </div>
  )
}
