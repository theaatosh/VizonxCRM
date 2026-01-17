import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { StatusCount } from "@/types/dashboard.types";

interface StatusBreakdownChartProps {
    title: string;
    subtitle?: string;
    data?: StatusCount[];
    isLoading?: boolean;
    colorMap?: Record<string, string>;
}

const defaultColorMap: Record<string, string> = {
    New: "hsl(var(--info))",
    Contacted: "hsl(var(--primary))",
    Qualified: "hsl(var(--warning))",
    Converted: "hsl(var(--success))",
    Pending: "hsl(var(--warning))",
    InProgress: "hsl(var(--info))",
    Completed: "hsl(var(--success))",
    Scheduled: "hsl(var(--primary))",
    Cancelled: "hsl(var(--destructive))",
    Prospective: "hsl(var(--info))",
    Enrolled: "hsl(var(--success))",
    Alumni: "hsl(var(--muted-foreground))",
    Approved: "hsl(var(--success))",
    Rejected: "hsl(var(--destructive))",
    Processing: "hsl(var(--warning))",
};

export function StatusBreakdownChart({
    title,
    subtitle,
    data,
    isLoading = false,
    colorMap = defaultColorMap
}: StatusBreakdownChartProps) {
    const chartData = data?.map(item => ({
        name: item.status,
        value: item.count,
        color: colorMap[item.status] || "hsl(var(--muted-foreground))",
    })) || [];

    const hasData = chartData.length > 0 && chartData.some(item => item.value > 0);
    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    if (isLoading) {
        return (
            <Card className="shadow-card">
                <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-48 mt-1" />
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="h-[200px] flex items-center justify-center">
                        <Skeleton className="h-32 w-32 rounded-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                        {total}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                {hasData ? (
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={70}
                                    paddingAngle={3}
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
                                    }}
                                    formatter={(value: number) => [value, "Count"]}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => (
                                        <span className="text-xs text-foreground">{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        <p className="text-sm">No data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
