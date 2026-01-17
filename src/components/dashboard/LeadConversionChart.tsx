import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { MonthlyTrend } from "@/types/dashboard.types";

interface LeadConversionChartProps {
  data?: MonthlyTrend[];
  isLoading?: boolean;
}

// Default data for when no data is provided
const defaultData: MonthlyTrend[] = [
  { month: "Jan", leads: 0, converted: 0 },
  { month: "Feb", leads: 0, converted: 0 },
  { month: "Mar", leads: 0, converted: 0 },
  { month: "Apr", leads: 0, converted: 0 },
  { month: "May", leads: 0, converted: 0 },
  { month: "Jun", leads: 0, converted: 0 },
];

export function LeadConversionChart({ data, isLoading = false }: LeadConversionChartProps) {
  const chartData = data && data.length > 0 ? data : defaultData;

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-full space-y-4">
              <Skeleton className="h-[250px] w-full" />
              <div className="flex justify-between px-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-8" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Lead Conversion</CardTitle>
        <p className="text-sm text-muted-foreground">Monthly leads vs conversions</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "var(--shadow-md)",
                }}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLeads)"
                name="Total Leads"
              />
              <Area
                type="monotone"
                dataKey="converted"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorConverted)"
                name="Converted"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
