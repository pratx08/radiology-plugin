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
  const imageBase = import.meta.env.BASE_URL
  const studyPreviewImages =
    order.modality === "CT"
      ? [`${imageBase}ct-2.jpg`, `${imageBase}ct-3.jpg`]
      : []

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/worklist")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">
              {order.patientName} - {order.modalityLabel} {order.bodySite}
            </h2>
            <p className="text-sm text-muted-foreground">
              {order.accessionNumber} | {order.patientId} | {order.age}
              {order.sex}
            </p>
          </div>
        </div>
        <Badge variant={statusBadgeVariant[localStatus]} className="px-3 py-1 text-sm">
          {localStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <Card className="bg-gray-900 text-gray-300">
            <CardContent className="space-y-4 p-4">
              {studyPreviewImages.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium text-white">CT Study Preview</p>
                      <p className="text-xs text-gray-400">
                        Representative slices for local review
                      </p>
                    </div>
                    <MonitorPlay className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {studyPreviewImages.map((src, index) => (
                      <div
                        key={src}
                        className="overflow-hidden rounded-lg border border-gray-800 bg-black"
                      >
                        <img
                          src={src}
                          alt={`CT preview ${index + 1}`}
                          className="h-72 w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-24">
                  <MonitorPlay className="mb-4 h-16 w-16 text-gray-500" />
                  <p className="text-lg font-medium text-gray-400">DICOM Viewer Preview</p>
                  <p className="mt-2 text-xs text-gray-600">
                    CT preview images are available for CT studies only
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-3 text-sm">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Study</p>
                  <p className="font-medium">
                    {order.modalityLabel} {order.bodySite}
                    {order.contrastRequired ? " with Contrast" : " without Contrast"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Series</p>
                  <p className="font-medium">{order.seriesCount ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Instances</p>
                  <p className="font-medium">{order.instanceCount ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Study Date</p>
                  <p className="font-medium">{order.orderDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Radiology Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-white shadow-md">
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

              <div className="space-y-2">
                <Label>Upload PDF Report</Label>
                <div className="rounded-md border-2 border-dashed border-gray-300 p-4 text-center text-sm text-muted-foreground">
                  <Upload className="mx-auto mb-1 h-6 w-6" />
                  Drag & drop or click to upload PDF
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Critical Result</Label>
                <Switch
                  checked={criticalResult}
                  onCheckedChange={setCriticalResult}
                  disabled={isReadOnly}
                />
              </div>
              {criticalResult && (
                <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                  <p className="text-sm text-red-800">
                    This report contains critical findings requiring immediate clinical
                    attention.
                  </p>
                </div>
              )}

              <Separator />

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
