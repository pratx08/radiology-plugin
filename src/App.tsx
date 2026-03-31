import { useState, useCallback } from "react"
import { HashRouter, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { Dashboard } from "@/pages/Dashboard"
import { CreateOrder } from "@/pages/CreateOrder"
import { Worklist } from "@/pages/Worklist"
import { ReportAuthoring } from "@/pages/ReportAuthoring"
import { PatientHistory } from "@/pages/PatientHistory"
import { Analytics } from "@/pages/Analytics"
import { ABDMCompliance } from "@/pages/ABDMCompliance"
import { initialOrders, type RadiologyOrder } from "@/data/mockData"

export default function App() {
  const [orders, setOrders] = useState<RadiologyOrder[]>(initialOrders)

  const handleCreateOrder = useCallback((order: RadiologyOrder) => {
    setOrders((prev) => [order, ...prev])
  }, [])

  const handleClaimOrder = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "In Progress" as const, radiologist: "Dr. Prathyaksh Nilson" }
          : o
      )
    )
  }, [])

  const handleUpdateOrder = useCallback(
    (orderId: string, updates: Partial<RadiologyOrder>) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
      )
    },
    []
  )

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard orders={orders} />} />
          <Route
            path="new-order"
            element={<CreateOrder onCreateOrder={handleCreateOrder} />}
          />
          <Route
            path="worklist"
            element={
              <Worklist orders={orders} onClaimOrder={handleClaimOrder} />
            }
          />
          <Route
            path="report/:orderId"
            element={
              <ReportAuthoring orders={orders} onUpdateOrder={handleUpdateOrder} />
            }
          />
          <Route path="patient" element={<PatientHistory />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="abdm" element={<ABDMCompliance />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
