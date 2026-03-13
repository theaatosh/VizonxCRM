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
import studentService from '@/services/student.service';
import { Student } from '@/types/student.types';
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
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
  const [staffList, setStaffList] = useState<User[]>([]);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [exactDate, setExactDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('scheduledAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Get current user info
  const currentUser = authService.getUser();
  const role = (currentUser as any)?.role || (currentUser as any)?.roleName;
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const staffId = isAdmin ? (selectedStaffId === 'all' ? undefined : selectedStaffId) : currentUser?.id;

  // Fetch staff and student list if admin/staff
  useEffect(() => {
    if (isAdmin) {
      userService.getAllUsers({ limit: 100 })
        .then(response => {
          const staff = response.data.filter(u => u.roleName !== 'STUDENT');
          setStaffList(staff);
        })
        .catch(error => console.error("Error fetching staff list:", error));
    }

    studentService.getStudents({ limit: 100 })
      .then(response => {
        setStudentList(response.data);
      })
      .catch(error => console.error("Error fetching student list:", error));
  }, [isAdmin]);

  // Fetch appointments
  const { data: appointmentsResponse, isLoading } = useAppointments({
    page,
    limit,
    sortOrder,
    sortBy,
    search: search || undefined,
    status: status === 'all' ? undefined : status,
    from: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : undefined,
    to: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : undefined,
    date: exactDate || undefined,
    staffId: isAdmin ? (selectedStaffId === 'all' ? undefined : selectedStaffId) : currentUser?.id,
    studentId: selectedStudentId === 'all' ? undefined : selectedStudentId,
  });

  const appointments = appointmentsResponse?.data || [];

  return (
    <DashboardLayout title="Appointments" subtitle="Manage schedules and consultations">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filters Section */}
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search appointments..."
                    className="pl-9 h-10"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                {/* Staff Selection (Admin only) or Status */}
                {isAdmin ? (
                  <Select value={selectedStaffId} onValueChange={(val) => {
                    setSelectedStaffId(val);
                    setPage(1);
                  }}>
                    <SelectTrigger className="h-10 bg-background border-primary/20 hover:border-primary/40 transition-colors">
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
                ) : (
                  <Select value={status} onValueChange={(val) => {
                    setStatus(val);
                    setPage(1);
                  }}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {Object.values(AppointmentStatus).map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Student Selection */}
                <Select value={selectedStudentId} onValueChange={(val) => {
                  setSelectedStudentId(val);
                  setPage(1);
                }}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    {studentList.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.firstName} {s.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status (If Admin, show after Student) */}
                {isAdmin && (
                  <Select value={status} onValueChange={(val) => {
                    setStatus(val);
                    setPage(1);
                  }}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {Object.values(AppointmentStatus).map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Date Filters */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-muted/50">
                <div className="flex flex-col gap-1.5 min-w-[280px]">
                  <span className="text-xs font-medium text-muted-foreground ml-1">Date Range</span>
                  <DatePickerWithRange
                    className="w-full"
                    date={dateRange}
                    setDate={(range) => {
                      setDateRange(range);
                      setExactDate('');
                      setPage(1);
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5 min-w-[160px]">
                  <span className="text-xs font-medium text-muted-foreground ml-1">Exact Date</span>
                  <Input
                    type="date"
                    className="h-10"
                    value={exactDate}
                    onChange={(e) => {
                      setExactDate(e.target.value);
                      setDateRange({ from: undefined, to: undefined });
                      setPage(1);
                    }}
                  />
                </div>

                <div className="flex items-end h-full pt-6">
                  {(search || status !== 'all' || selectedStaffId !== 'all' || selectedStudentId !== 'all' || dateRange?.from || dateRange?.to || exactDate) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearch('');
                        setStatus('all');
                        setSelectedStaffId('all');
                        setSelectedStudentId('all');
                        setDateRange({ from: undefined, to: undefined });
                        setExactDate('');
                        setPage(1);
                      }}
                      className="text-muted-foreground h-10 hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-all"
                    >
                      <FilterX className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
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
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(field) => {
            if (sortBy === field) {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            } else {
              setSortBy(field);
              setSortOrder('desc');
            }
          }}
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
