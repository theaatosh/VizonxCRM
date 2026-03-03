import { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTablePagination } from '@/components/shared/DataTablePagination';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AppointmentsTable } from "@/components/appointments/AppointmentsTable";
import { AppointmentFormDialog } from "@/components/appointments/AppointmentFormDialog";
import { useAppointments } from "@/hooks/useAppointments";

const Appointments = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch appointments
  const { data: appointmentsResponse, isLoading } = useAppointments({
    page,
    limit,
    sortOrder: 'desc',
    sortBy: 'scheduledAt'
  });

  const appointments = appointmentsResponse?.data || [];

  return (
    <DashboardLayout title="Appointments" subtitle="Manage schedules and consultations">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            {/* Could add filters here later */}
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>

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
