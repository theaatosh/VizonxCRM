import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    GraduationCap,
    Building2,
    Globe,
    FileCheck,
    BookOpen,
    FileText,
    HelpCircle,
    Layout,
    Award
} from "lucide-react";
import type {
    UniversitiesData,
    CoursesData,
    CountriesData,
    VisaTypesData,
    CMSData
} from "@/types/dashboard.types";

interface QuickStatsGridProps {
    universities?: UniversitiesData;
    courses?: CoursesData;
    countries?: CountriesData;
    visaTypes?: VisaTypesData;
    cms?: CMSData;
    isLoading?: boolean;
}

interface StatItemProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    sublabel?: string;
    color: string;
}

function StatItem({ icon, value, label, sublabel, color }: StatItemProps) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
                {sublabel && (
                    <p className="text-xs text-muted-foreground/70">{sublabel}</p>
                )}
            </div>
        </div>
    );
}

function GridSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-8" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function QuickStatsGrid({
    universities,
    courses,
    countries,
    visaTypes,
    cms,
    isLoading = false
}: QuickStatsGridProps) {
    if (isLoading) {
        return (
            <Card className="shadow-card">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                    <GridSkeleton />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
                <p className="text-sm text-muted-foreground">Platform overview</p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <StatItem
                        icon={<Globe className="h-4 w-4" />}
                        value={countries?.total || 0}
                        label="Countries"
                        color="bg-blue-500/10 text-blue-500"
                    />
                    <StatItem
                        icon={<Building2 className="h-4 w-4" />}
                        value={universities?.total || 0}
                        label="Universities"
                        color="bg-purple-500/10 text-purple-500"
                    />
                    <StatItem
                        icon={<BookOpen className="h-4 w-4" />}
                        value={courses?.total || 0}
                        label="Courses"
                        color="bg-green-500/10 text-green-500"
                    />
                    <StatItem
                        icon={<FileCheck className="h-4 w-4" />}
                        value={visaTypes?.total || 0}
                        label="Visa Types"
                        color="bg-orange-500/10 text-orange-500"
                    />
                    <StatItem
                        icon={<Award className="h-4 w-4" />}
                        value={cms?.scholarships?.total || 0}
                        label="Scholarships"
                        sublabel={`${cms?.scholarships?.published || 0} published`}
                        color="bg-yellow-500/10 text-yellow-500"
                    />
                    <StatItem
                        icon={<FileText className="h-4 w-4" />}
                        value={cms?.blogs?.total || 0}
                        label="Blog Posts"
                        sublabel={`${cms?.blogs?.published || 0} published`}
                        color="bg-pink-500/10 text-pink-500"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
