import { KPICard } from "@/components/dashboard/KPICard";
import { Users, CheckSquare, Calendar, List, Activity, Gauge } from "lucide-react";
import type { StaffWorkload } from "@/types/staff.types";

interface CounselorKpiCardsProps {
    workload?: StaffWorkload;
    isLoading?: boolean;
}

export function CounselorKpiCards({ workload, isLoading }: CounselorKpiCardsProps) {
    return (
        <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-3 mb-6">
            <KPICard
                title="Active Leads"
                value={workload?.activeLeads || 0}
                icon={<Users className="h-6 w-6" />}
                iconColor="primary"
                isLoading={isLoading}
            />
            <KPICard
                title="Open Tasks"
                value={workload?.openTasks || 0}
                icon={<CheckSquare className="h-6 w-6" />}
                iconColor="warning"
                isLoading={isLoading}
            />
            <KPICard
                title="Follow Ups Today"
                value={workload?.pendingFollowUps || 0}
                icon={<Calendar className="h-6 w-6" />}
                iconColor="info"
                isLoading={isLoading}
            />
            <KPICard
                title="Queue Items"
                value={workload?.queueLoad || 0}
                icon={<List className="h-6 w-6" />}
                iconColor="primary"
                isLoading={isLoading}
            />
            <KPICard
                title="Today's Calls"
                value={workload?.todayCalls || 0}
                icon={<Activity className="h-6 w-6" />}
                iconColor="success"
                isLoading={isLoading}
            />
            <KPICard
                title="Workload"
                value={`${workload?.workloadPercentage || 0}%`}
                icon={<Gauge className="h-6 w-6" />}
                iconColor="warning"
                isLoading={isLoading}
            />
        </div>
    );
}
