import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { LeadConversionChart } from "@/components/dashboard/LeadConversionChart";
import { StatusBreakdownChart } from "@/components/dashboard/StatusBreakdownChart";
import { RecentLeadsTable } from "@/components/dashboard/RecentLeadsTable";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { QuickStatsGrid } from "@/components/dashboard/QuickStatsGrid";
import { MessagingStats } from "@/components/dashboard/MessagingStats";
import { ChatWidget } from "@/components/dashboard/ChatWidget";
import { useDashboardOverview } from "@/hooks/useDashboard";
import {
  Users,
  UserCheck,
  Plane,
  CheckSquare,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Calendar,
  DollarSign,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: dashboard, isLoading, isError, error, refetch, isRefetching } = useDashboardOverview();

  // Format number with thousand separators
  const formatNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString();
  };

  // Calculate conversion rate
  const conversionRate = dashboard?.leads?.total
    ? ((dashboard.leads.converted / dashboard.leads.total) * 100).toFixed(1)
    : "0";

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back! Here's your overview"
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      }
    >
      {/* Error State */}
      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading dashboard</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error?.message || "Failed to load dashboard data. Please try again."}</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main KPI Cards - First Row */}
      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-6">
        <KPICard
          title="Total Leads"
          value={formatNumber(dashboard?.leads?.total)}
          change={dashboard?.leads?.converted ? Number(conversionRate) : undefined}
          changeLabel="conversion rate"
          icon={<Users className="h-6 w-6" />}
          iconColor="primary"
          isLoading={isLoading}
        />
        <KPICard
          title="Active Students"
          value={formatNumber(dashboard?.students?.total)}
          icon={<UserCheck className="h-6 w-6" />}
          iconColor="info"
          isLoading={isLoading}
        />
        <KPICard
          title="Visa Applications"
          value={formatNumber(dashboard?.visaApplications?.total)}
          change={dashboard?.visaApplications?.active}
          changeLabel="active"
          icon={<Plane className="h-6 w-6" />}
          iconColor="success"
          isLoading={isLoading}
        />
        <KPICard
          title="Total Tasks"
          value={formatNumber(dashboard?.tasks?.total)}
          change={dashboard?.tasks?.overdue ? -dashboard.tasks.overdue : undefined}
          changeLabel="overdue"
          icon={<CheckSquare className="h-6 w-6" />}
          iconColor="warning"
          isLoading={isLoading}
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboard?.leads?.converted || 0}</p>
                  <p className="text-xs text-muted-foreground">Converted Leads</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboard?.appointments?.total || 0}</p>
                  <p className="text-xs text-muted-foreground">Appointments</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ${formatNumber(dashboard?.payments?.revenue?.total || 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${(dashboard?.tasks?.overdue || 0) > 0
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-success/10 text-success'
                  }`}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboard?.tasks?.overdue || 0}</p>
                  <p className="text-xs text-muted-foreground">Overdue Tasks</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2">
          <StatusBreakdownChart
            title="Lead Status"
            subtitle="Distribution by status"
            data={dashboard?.leads?.byStatus}
            isLoading={isLoading}
          />
        </div>
        <StatusBreakdownChart
          title="Task Status"
          subtitle="Current task breakdown"
          data={dashboard?.tasks?.byStatus}
          isLoading={isLoading}
        />
      </div>

      {/* Students and Appointments Charts */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3 mb-6">
        <StatusBreakdownChart
          title="Student Status"
          subtitle="Student breakdown"
          data={dashboard?.students?.byStatus}
          isLoading={isLoading}
        />
        <StatusBreakdownChart
          title="Appointments"
          subtitle="By status"
          data={dashboard?.appointments?.byStatus}
          isLoading={isLoading}
        />
        <QuickStatsGrid
          universities={dashboard?.universities}
          courses={dashboard?.courses}
          countries={dashboard?.countries}
          visaTypes={dashboard?.visaTypes}
          cms={dashboard?.cms}
          isLoading={isLoading}
        />
      </div>

      {/* Tables and Lists Row */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2">
          <RecentLeadsTable
            leads={dashboard?.leads?.recent}
            isLoading={isLoading}
          />
        </div>
        <UpcomingAppointments
          appointments={dashboard?.appointments?.upcoming}
          isLoading={isLoading}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingTasks
            tasks={dashboard?.tasks?.upcoming}
            isLoading={isLoading}
          />
        </div>
        <MessagingStats
          messaging={dashboard?.messaging}
          templates={dashboard?.templates}
          isLoading={isLoading}
        />
      </div>

      {/* Floating Chat Widget */}
      <ChatWidget />
    </DashboardLayout>
  );
};

export default Index;
