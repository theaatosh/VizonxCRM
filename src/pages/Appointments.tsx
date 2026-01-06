import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video, MapPin, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const todayAppointments = [
  {
    id: 1,
    client: "Sarah Johnson",
    time: "09:00 AM",
    duration: "30 min",
    type: "Video Call",
    counsellor: "John Smith",
    topic: "UK Visa Consultation",
    status: "Upcoming",
  },
  {
    id: 2,
    client: "Michael Chen",
    time: "10:30 AM",
    duration: "45 min",
    type: "In-Person",
    counsellor: "Emma Wilson",
    topic: "Canada Study Permit",
    status: "In Progress",
  },
  {
    id: 3,
    client: "Priya Sharma",
    time: "02:00 PM",
    duration: "30 min",
    type: "Video Call",
    counsellor: "David Brown",
    topic: "Australia Visa Documents",
    status: "Upcoming",
  },
  {
    id: 4,
    client: "Ahmed Hassan",
    time: "03:30 PM",
    duration: "1 hour",
    type: "In-Person",
    counsellor: "John Smith",
    topic: "Germany Application Review",
    status: "Upcoming",
  },
];

const completedAppointments = [
  {
    id: 5,
    client: "Lisa Wang",
    time: "Yesterday, 11:00 AM",
    duration: "45 min",
    type: "Video Call",
    counsellor: "Emma Wilson",
    topic: "USA F-1 Visa Prep",
  },
  {
    id: 6,
    client: "Carlos Rodriguez",
    time: "Yesterday, 02:30 PM",
    duration: "30 min",
    type: "Phone Call",
    counsellor: "David Brown",
    topic: "Initial Consultation",
  },
];

const statusColors: Record<string, string> = {
  Upcoming: "bg-info/10 text-info border-info/20",
  "In Progress": "bg-success/10 text-success border-success/20",
  Completed: "bg-muted text-muted-foreground",
};

const typeIcons: Record<string, React.ReactNode> = {
  "Video Call": <Video className="h-4 w-4" />,
  "In-Person": <MapPin className="h-4 w-4" />,
  "Phone Call": <Clock className="h-4 w-4" />,
};

const Appointments = () => {
  return (
    <DashboardLayout title="Appointments" subtitle="Manage counsellor schedules">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Widget */}
        <Card className="shadow-card lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">January 2024</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="py-2 text-muted-foreground font-medium">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  className={`py-2 rounded-lg transition-colors ${
                    day === 16
                      ? "bg-primary text-primary-foreground"
                      : [10, 15, 22, 25].includes(day)
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "hover:bg-muted"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <Button className="w-full gap-2">
                <Plus className="h-4 w-4" />
                New Appointment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Today's Schedule</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  January 16, 2024
                </p>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {todayAppointments.length} appointments
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-col items-center justify-center w-16 text-center">
                  <p className="text-lg font-bold text-foreground">{apt.time.split(" ")[0]}</p>
                  <p className="text-xs text-muted-foreground">{apt.time.split(" ")[1]}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${apt.client}`} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {apt.client
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{apt.client}</p>
                      <p className="text-sm text-muted-foreground">{apt.topic}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm hidden sm:block">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {typeIcons[apt.type]}
                      {apt.type}
                    </div>
                    <p className="text-muted-foreground">{apt.duration}</p>
                  </div>
                  <Badge variant="outline" className={statusColors[apt.status]}>
                    {apt.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Completed Appointments */}
      <Card className="shadow-card mt-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Recently Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between rounded-lg border border-border p-4 opacity-75"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${apt.client}`} />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {apt.client
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{apt.client}</p>
                    <p className="text-sm text-muted-foreground">{apt.topic}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted-foreground">{apt.time}</p>
                  <p className="text-muted-foreground">{apt.duration} • {apt.counsellor}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Appointments;
