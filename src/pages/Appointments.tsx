import { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AppointmentsTable } from "@/components/appointments/AppointmentsTable";
import { AppointmentFormDialog } from "@/components/appointments/AppointmentFormDialog";
import { useAppointments } from "@/hooks/useAppointments";

const Appointments = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fetch appointments
  const { data: appointmentsResponse, isLoading } = useAppointments({
    limit: 100,
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
