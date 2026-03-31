import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { addToast } from "@/components/ui/toaster"
import { CheckCircle2, ArrowRight } from "lucide-react"
import {
  patientOptions,
  modalityOptions,
  bodySiteOptions,
  type RadiologyOrder,
} from "@/data/mockData"

interface CreateOrderProps {
  onCreateOrder: (order: RadiologyOrder) => void
}

export function CreateOrder({ onCreateOrder }: CreateOrderProps) {
  const navigate = useNavigate()
  const [patient, setPatient] = useState("")
  const [modality, setModality] = useState("")
  const [bodySite, setBodySite] = useState("")
  const [bodySiteSearch, setBodySiteSearch] = useState("")
  const [showBodySiteDropdown, setShowBodySiteDropdown] = useState(false)
  const [laterality, setLaterality] = useState("N/A")
  const [contrastRequired, setContrastRequired] = useState(false)
  const [clinicalIndication, setClinicalIndication] = useState("")
  const [priority, setPriority] = useState("Routine")
  const [submitted, setSubmitted] = useState<RadiologyOrder | null>(null)

  const filteredBodySites = bodySiteOptions.filter((s) =>
    s.label.toLowerCase().includes(bodySiteSearch.toLowerCase())
  )

  const handleSubmit = () => {
    if (!patient || !modality || !bodySite || !clinicalIndication) {
      addToast({
        id: Math.random().toString(36).slice(2),
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const selectedPatient = patientOptions.find(
      (p) => `${p.name} - ${p.id}` === patient
    )
    const selectedModality = modalityOptions.find((m) => m.value === modality)
    const selectedBodySite = bodySiteOptions.find((s) => s.value === bodySite)
    const accNum = `ACC-2026-${String(Math.floor(Math.random() * 90000 + 10000)).slice(0, 5)}`

    const newOrder: RadiologyOrder = {
      id: `ord-new-${Date.now()}`,
      accessionNumber: accNum,
      patientName: selectedPatient?.name || "",
      patientId: selectedPatient?.id || "",
      age: selectedPatient?.age || 0,
      sex: selectedPatient?.sex || "M",
      modality: modality as RadiologyOrder["modality"],
      modalityLabel: selectedModality?.label || modality,
      bodySite: selectedBodySite?.value || bodySite,
      bodySiteCode: selectedBodySite?.code || "",
      laterality,
      contrastRequired,
      clinicalIndication,
      priority: priority as RadiologyOrder["priority"],
      status: "Ordered",
      orderDate: new Date().toISOString().slice(0, 10),
      radiologist: null,
      facility: "District Hospital Ernakulam",
      findings: null,
      conclusion: null,
      conclusionCode: null,
      impression: null,
      criticalResult: false,
      seriesCount: null,
      instanceCount: null,
    }

    onCreateOrder(newOrder)
    setSubmitted(newOrder)

    addToast({
      id: Math.random().toString(36).slice(2),
      title: "Order Created Successfully",
      description: `Accession: ${accNum}`,
      variant: "success",
    })
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          <div>
            <h2 className="text-2xl font-bold">Order Created</h2>
            <p className="text-sm text-muted-foreground">
              Imaging order has been submitted successfully
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Order Summary</CardTitle>
              <Badge variant="gray">Ordered</Badge>
            </div>
            <CardDescription>Accession: {submitted.accessionNumber}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-muted-foreground">Patient</p>
                <p className="font-medium">{submitted.patientName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Patient ID</p>
                <p className="font-medium">{submitted.patientId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Modality</p>
                <p className="font-medium">{submitted.modalityLabel}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Body Site</p>
                <p className="font-medium">{submitted.bodySite} ({submitted.bodySiteCode})</p>
              </div>
              <div>
                <p className="text-muted-foreground">Laterality</p>
                <p className="font-medium">{submitted.laterality}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Contrast</p>
                <p className="font-medium">{submitted.contrastRequired ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Priority</p>
                <p className="font-medium">{submitted.priority}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Order Date</p>
                <p className="font-medium">{submitted.orderDate}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-muted-foreground">Clinical Indication</p>
              <p className="font-medium">{submitted.clinicalIndication}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => navigate("/worklist")} className="gap-2">
            View in Worklist
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(null)
              setPatient("")
              setModality("")
              setBodySite("")
              setBodySiteSearch("")
              setLaterality("N/A")
              setContrastRequired(false)
              setClinicalIndication("")
              setPriority("Routine")
            }}
          >
            Create Another Order
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Create Imaging Order</h2>
        <p className="text-sm text-muted-foreground">
          Order a new radiology study within a consultation context
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Imaging Order Form</CardTitle>
          <CardDescription>
            Fill in the details below to create a new imaging order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Patient Selector */}
          <div className="space-y-2">
            <Label>Patient *</Label>
            <Select value={patient} onValueChange={setPatient}>
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patientOptions.map((p) => (
                  <SelectItem key={p.id} value={`${p.name} - ${p.id}`}>
                    {p.name} — {p.id} ({p.age}{p.sex})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Modality */}
          <div className="space-y-2">
            <Label>Modality *</Label>
            <Select value={modality} onValueChange={setModality}>
              <SelectTrigger>
                <SelectValue placeholder="Select modality" />
              </SelectTrigger>
              <SelectContent>
                {modalityOptions.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Body Site with autocomplete */}
          <div className="space-y-2">
            <Label>Body Site (SNOMED) *</Label>
            <div className="relative">
              <Input
                placeholder="Search body site..."
                value={bodySiteSearch}
                onChange={(e) => {
                  setBodySiteSearch(e.target.value)
                  setShowBodySiteDropdown(true)
                }}
                onFocus={() => setShowBodySiteDropdown(true)}
              />
              {showBodySiteDropdown && bodySiteSearch && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-md max-h-48 overflow-auto">
                  {filteredBodySites.map((s) => (
                    <button
                      key={s.value}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                      onClick={() => {
                        setBodySite(s.value)
                        setBodySiteSearch(s.label)
                        setShowBodySiteDropdown(false)
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                  {filteredBodySites.length === 0 && (
                    <p className="px-3 py-2 text-sm text-muted-foreground">No results</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Laterality */}
          <div className="space-y-2">
            <Label>Laterality</Label>
            <div className="flex gap-3">
              {["Left", "Right", "Bilateral", "N/A"].map((l) => (
                <label
                  key={l}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name="laterality"
                    value={l}
                    checked={laterality === l}
                    onChange={(e) => setLaterality(e.target.value)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  {l}
                </label>
              ))}
            </div>
          </div>

          {/* Contrast Required */}
          <div className="flex items-center justify-between">
            <Label>Contrast Required</Label>
            <Switch
              checked={contrastRequired}
              onCheckedChange={setContrastRequired}
            />
          </div>

          {/* Clinical Indication */}
          <div className="space-y-2">
            <Label>Clinical Indication *</Label>
            <Textarea
              placeholder="e.g., Persistent cough for 3 weeks, rule out pneumonia"
              value={clinicalIndication}
              onChange={(e) => setClinicalIndication(e.target.value)}
              rows={3}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Routine">Routine</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="STAT">STAT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <Button onClick={handleSubmit} className="w-full">
            Submit Imaging Order
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
