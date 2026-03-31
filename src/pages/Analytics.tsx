import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { addToast } from "@/components/ui/toaster"
import { Download, Clock, Activity, TrendingDown, FileCheck } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { tatByModality, weeklyTatTrend, tatByFacility } from "@/data/mockData"

const summaryCards = [
  { title: "Average TAT", value: "18.4 hrs", icon: Clock, color: "text-primary" },
  { title: "Median TAT", value: "14.2 hrs", icon: Activity, color: "text-emerald-600" },
  { title: "95th Percentile", value: "48.6 hrs", icon: TrendingDown, color: "text-amber-600" },
  { title: "Reports This Month", value: "142", icon: FileCheck, color: "text-blue-600" },
]

export function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Radiology Turnaround Time Analytics</h2>
          <p className="text-sm text-muted-foreground">
            March 2026 | All Facilities
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() =>
            addToast({
              id: Math.random().toString(36).slice(2),
              title: "Export Started",
              description: "CSV report is being generated...",
            })
          }
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
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

      {/* Row 2: Bar + Line */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* TAT by Modality */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">TAT by Modality</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={tatByModality} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="modality" fontSize={12} />
                <YAxis fontSize={12} label={{ value: "Hours", angle: -90, position: "insideLeft", style: { fontSize: 12 } }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                  formatter={(value: number) => [`${value} hrs`, "TAT"]}
                />
                <Bar dataKey="tat" radius={[4, 4, 0, 0]}>
                  {tatByModality.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">
              MRI TAT exceeds 24-hour threshold (shown in red)
            </p>
          </CardContent>
        </Card>

        {/* Weekly TAT Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly TAT Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyTatTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" fontSize={12} />
                <YAxis fontSize={12} domain={[14, 26]} label={{ value: "Hours", angle: -90, position: "insideLeft", style: { fontSize: 12 } }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                  formatter={(value: number) => [`${value} hrs`, "Avg TAT"]}
                />
                <Line
                  type="monotone"
                  dataKey="tat"
                  stroke="#1a5276"
                  strokeWidth={2}
                  dot={{ fill: "#1a5276", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">
              Gradual improvement trend — 24.2 hrs to 18.4 hrs over 8 weeks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: TAT by Facility (horizontal bar) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">TAT by Facility</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={tatByFacility}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 160, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" fontSize={12} label={{ value: "Hours", position: "insideBottom", offset: -2, style: { fontSize: 12 } }} />
              <YAxis
                type="category"
                dataKey="facility"
                fontSize={12}
                width={150}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                formatter={(value: number) => [`${value} hrs`, "TAT"]}
              />
              <Bar dataKey="tat" radius={[0, 4, 4, 0]}>
                {tatByFacility.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">
            PHC Perumbavoor exceeds 24-hour threshold (shown in red). CHC Aluva approaching threshold (shown in amber).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
