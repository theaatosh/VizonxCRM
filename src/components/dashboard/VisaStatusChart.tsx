import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface VisaStatusData {
  name: string;
  value: number;
  color: string;
}

interface VisaStatusChartProps {
  data?: VisaStatusData[];
  isLoading?: boolean;
}

// Default data for when no data is provided
const defaultData: VisaStatusData[] = [
  { name: "Approved", value: 0, color: "hsl(var(--success))" },
  { name: "Pending", value: 0, color: "hsl(var(--warning))" },
  { name: "In Process", value: 0, color: "hsl(var(--info))" },
  { name: "Rejected", value: 0, color: "hsl(var(--destructive))" },
];

export function VisaStatusChart({ data, isLoading = false }: VisaStatusChartProps) {
  const chartData = data && data.length > 0 ? data : defaultData;
  const hasData = chartData.some(item => item.value > 0);

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-52 mt-1" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Visa Status Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Current visa application status</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px]">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "var(--shadow-md)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>No visa data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
