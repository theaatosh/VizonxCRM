import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { LeadConversionChart } from "@/components/dashboard/LeadConversionChart";
import { VisaStatusChart } from "@/components/dashboard/VisaStatusChart";
import { RecentLeadsTable } from "@/components/dashboard/RecentLeadsTable";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { Users, UserCheck, Plane, CheckSquare } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout title="Overview" subtitle="Welcome back, Admin">
      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPICard
          title="Total Leads"
          value="1,284"
          change={12.5}
          changeLabel="vs last month"
          icon={<Users className="h-6 w-6" />}
          iconColor="primary"
        />
        <KPICard
          title="Active Applicants"
          value="482"
          change={8.2}
          changeLabel="vs last month"
          icon={<UserCheck className="h-6 w-6" />}
          iconColor="info"
        />
        <KPICard
          title="Approved Visas"
          value="156"
          change={23.1}
          changeLabel="vs last month"
          icon={<Plane className="h-6 w-6" />}
          iconColor="success"
        />
        <KPICard
          title="Pending Tasks"
          value="43"
          change={-5.4}
          changeLabel="vs last week"
          icon={<CheckSquare className="h-6 w-6" />}
          iconColor="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <LeadConversionChart />
        <VisaStatusChart />
      </div>

      {/* Tables Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentLeadsTable />
        </div>
        <div>
          <UpcomingTasks />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
