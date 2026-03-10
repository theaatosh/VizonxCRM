import { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTablePagination } from '@/components/shared/DataTablePagination';
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar as CalendarIcon, FilterX, Users } from "lucide-react";
import { AppointmentsTable } from "@/components/appointments/AppointmentsTable";
import { AppointmentFormDialog } from "@/components/appointments/AppointmentFormDialog";
import { useAppointments } from "@/hooks/useAppointments";
import authService from '@/services/auth.service';
import userService, { User } from '@/services/user.service';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentStatus } from '@/types/appointment.types';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

const Appointments = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [staffList, setStaffList] = useState<User[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  // Get current user info
  const currentUser = authService.getUser();
  const role = (currentUser as any)?.role || (currentUser as any)?.roleName;
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const staffId = isAdmin ? (selectedStaffId === 'all' ? undefined : selectedStaffId) : currentUser?.id;

  // Fetch staff list if admin
  useEffect(() => {
    if (isAdmin) {
      userService.getAllUsers({ limit: 100 })
        .then(response => {
          // Filter users who are not students
          const staff = response.data.filter(u => u.roleName !== 'STUDENT');
          setStaffList(staff);
        })
        .catch(error => console.error("Error fetching staff list:", error));
    }
  }, [isAdmin]);

  // Fetch appointments
  const { data: appointmentsResponse, isLoading } = useAppointments(
    {
      page,
      limit,
      sortOrder: 'desc',
      sortBy: 'scheduledAt',
      search: search || undefined,
      status: status === 'all' ? undefined : status,
      from: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : undefined,
      to: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : undefined,
    },
    role,
    staffId
  );

  const appointments = appointmentsResponse?.data || [];

  return (
    <DashboardLayout title="Appointments" subtitle="Manage schedules and consultations">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search appointments..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {isAdmin && (
                <Select value={selectedStaffId} onValueChange={(val) => {
                  setSelectedStaffId(val);
                  setPage(1);
                }}>
                  <SelectTrigger className="w-48 bg-background border-primary/20 hover:border-primary/40 transition-colors">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <SelectValue placeholder="All Staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    {staffList.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={status} onValueChange={(val) => {
                setStatus(val);
                setPage(1);
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.values(AppointmentStatus).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DatePickerWithRange
                className="w-[280px]"
                date={dateRange}
                setDate={(range) => {
                  setDateRange(range);
                  setPage(1);
                }}
              />

              {(search || status !== 'all' || selectedStaffId !== 'all' || dateRange?.from || dateRange?.to) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setStatus('all');
                    setSelectedStaffId('all');
                    setDateRange({ from: undefined, to: undefined });
                    setPage(1);
                  }}
                  className="text-muted-foreground px-2 hover:text-destructive hover:bg-destructive/5"
                >
                  <FilterX className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>

            <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-sm hover:shadow-md transition-all">
              <Plus className="h-4 w-4" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Info Card for Admin filtering */}
        {isAdmin && selectedStaffId !== 'all' && (
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm">
              Showing all appointments for <span className="font-semibold text-primary">{staffList.find(s => s.id === selectedStaffId)?.name}</span>
            </p>
          </div>
        )}

        {/* Appointments Table */}
        <AppointmentsTable
          appointments={appointments}
          isLoading={isLoading}
        />

        {/* Pagination */}
        {appointmentsResponse && (
          <DataTablePagination
            pageIndex={page}
            pageSize={limit}
            totalItems={appointmentsResponse.total}
            totalPages={appointmentsResponse.totalPages}
            onPageChange={setPage}
            onPageSizeChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        )}

        {/* Create Dialog */}
        <AppointmentFormDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
