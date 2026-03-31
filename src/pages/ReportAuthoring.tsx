import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { addToast } from "@/components/ui/toaster"
import { MonitorPlay, Upload, AlertTriangle, ArrowLeft } from "lucide-react"
import { type RadiologyOrder, conclusionOptions } from "@/data/mockData"

const statusBadgeVariant: Record<string, "gray" | "info" | "warning" | "success"> = {
  Ordered: "gray",
  "In Progress": "info",
  Reported: "warning",
  Final: "success",
}

interface ReportAuthoringProps {
  orders: RadiologyOrder[]
  onUpdateOrder: (orderId: string, updates: Partial<RadiologyOrder>) => void
}

export function ReportAuthoring({ orders, onUpdateOrder }: ReportAuthoringProps) {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const order = orders.find((o) => o.id === orderId)

  const [findings, setFindings] = useState(order?.findings || "")
  const [conclusion, setConclusion] = useState(order?.conclusion || "")
  const [conclusionCode, setConclusionCode] = useState(order?.conclusionCode || "")
  const [impression, setImpression] = useState(order?.impression || "")
  const [criticalResult, setCriticalResult] = useState(order?.criticalResult || false)
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false)
  const [localStatus, setLocalStatus] = useState(order?.status || "In Progress")
  const [showConclusionDropdown, setShowConclusionDropdown] = useState(false)
  const [conclusionSearch, setConclusionSearch] = useState(
    order?.conclusion && order?.conclusionCode
      ? `${order.conclusion} (${order.conclusionCode})`
      : ""
  )

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-muted-foreground">Order not found</p>
        <Button variant="outline" onClick={() => navigate("/worklist")}>
          Back to Worklist
        </Button>
      </div>
    )
  }

  const isReadOnly = localStatus === "Final"

  const filteredConclusions = conclusionOptions.filter((c) =>
    c.label.toLowerCase().includes(conclusionSearch.toLowerCase())
  )

  const handleSaveDraft = () => {
    onUpdateOrder(order.id, { findings, conclusion, conclusionCode, impression, criticalResult })
    addToast({
      id: Math.random().toString(36).slice(2),
      title: "Draft Saved",
      description: "Report draft has been saved.",
    })
  }

  const handleSubmitPreliminary = () => {
    onUpdateOrder(order.id, {
      findings,
      conclusion,
      conclusionCode,
      impression,
      criticalResult,
      status: "Reported",
    })
    setLocalStatus("Reported")
    addToast({
      id: Math.random().toString(36).slice(2),
      title: "Preliminary Report Submitted",
      variant: "success",
    })
  }

  const handleFinalize = () => {
    onUpdateOrder(order.id, {
      findings,
      conclusion,
      conclusionCode,
      impression,
      criticalResult,
      status: "Final",
    })
    setLocalStatus("Final")
    setShowFinalizeDialog(false)
    addToast({
      id: Math.random().toString(36).slice(2),
      title: "Report Finalized",
      description: "The report has been finalized and is now read-only.",
      variant: "success",
    })
  }

  const handleAmend = () => {
    setLocalStatus("Reported")
    onUpdateOrder(order.id, { status: "Reported" })
    addToast({
      id: Math.random().toString(36).slice(2),
      title: "Report Amended",
      description: "The report is now editable for amendments.",
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/worklist")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">
              {order.patientName} — {order.modalityLabel} {order.bodySite}
            </h2>
            <p className="text-sm text-muted-foreground">
              {order.accessionNumber} | {order.patientId} | {order.age}{order.sex}
            </p>
          </div>
        </div>
        <Badge variant={statusBadgeVariant[localStatus]} className="text-sm px-3 py-1">
          {localStatus}
        </Badge>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* LEFT — Viewer Placeholder (3/5) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-gray-900 text-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-24">
              <MonitorPlay className="h-16 w-16 mb-4 text-gray-500" />
              <p className="text-lg font-medium text-gray-400">
                DICOM Viewer — OHIF Integration
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Images loaded from Orthanc via DICOMweb (WADO-RS)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-3 text-sm">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Study</p>
                  <p className="font-medium">
                    {order.modalityLabel} {order.bodySite}
                    {order.contrastRequired ? " with Contrast" : " without Contrast"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Series</p>
                  <p className="font-medium">{order.seriesCount ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Instances</p>
                  <p className="font-medium">{order.instanceCount ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Study Date</p>
                  <p className="font-medium">{order.orderDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT — Report Form (2/5) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Radiology Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Findings */}
              <div className="space-y-2">
                <Label>Findings</Label>
                <Textarea
                  placeholder="Describe imaging findings..."
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  rows={8}
                  disabled={isReadOnly}
                />
              </div>

              {/* Conclusion with SNOMED autocomplete */}
              <div className="space-y-2">
                <Label>Conclusion (ICD / SNOMED)</Label>
                <div className="relative">
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Search diagnosis..."
                    value={conclusionSearch}
                    onChange={(e) => {
                      setConclusionSearch(e.target.value)
                      setShowConclusionDropdown(true)
                    }}
                    onFocus={() => setShowConclusionDropdown(true)}
                    disabled={isReadOnly}
                  />
                  {showConclusionDropdown && conclusionSearch && !isReadOnly && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-md max-h-48 overflow-auto">
                      {filteredConclusions.map((c) => (
                        <button
                          key={c.code}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                          onClick={() => {
                            setConclusion(c.value)
                            setConclusionCode(c.code)
                            setConclusionSearch(c.label)
                            setShowConclusionDropdown(false)
                          }}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Impression */}
              <div className="space-y-2">
                <Label>Impression</Label>
                <Textarea
                  placeholder="Summary impression..."
                  value={impression}
                  onChange={(e) => setImpression(e.target.value)}
                  rows={3}
                  disabled={isReadOnly}
                />
              </div>

              {/* Upload PDF */}
              <div className="space-y-2">
                <Label>Upload PDF Report</Label>
                <div className="rounded-md border-2 border-dashed border-gray-300 p-4 text-center text-sm text-muted-foreground">
                  <Upload className="mx-auto h-6 w-6 mb-1" />
                  Drag & drop or click to upload PDF
                </div>
              </div>

              {/* Critical Results */}
              <div className="flex items-center justify-between">
                <Label className="text-sm">Critical Result</Label>
                <Switch
                  checked={criticalResult}
                  onCheckedChange={setCriticalResult}
                  disabled={isReadOnly}
                />
              </div>
              {criticalResult && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">
                    This report contains critical findings requiring immediate clinical attention.
                  </p>
                </div>
              )}

              <Separator />

              {/* Action Bar */}
              <div className="flex flex-wrap gap-2">
                {!isReadOnly && (
                  <>
                    <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                      Save Draft
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSubmitPreliminary}>
                      Submit Preliminary
                    </Button>
                    <Button size="sm" onClick={() => setShowFinalizeDialog(true)}>
                      Finalize
                    </Button>
                  </>
                )}
                {isReadOnly && (
                  <Button variant="outline" size="sm" onClick={handleAmend}>
                    Amend Report
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Finalize Dialog */}
      <Dialog open={showFinalizeDialog} onOpenChange={setShowFinalizeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalize Report</DialogTitle>
            <DialogDescription>
              Are you sure? Finalized reports cannot be edited, only amended.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFinalizeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleFinalize}>Confirm & Finalize</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
