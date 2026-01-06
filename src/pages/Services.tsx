import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  GraduationCap, 
  FileText, 
  Users, 
  BookOpen, 
  Plane, 
  Building, 
  Plus,
  Settings,
  DollarSign
} from "lucide-react";

const services = [
  {
    id: 1,
    name: "University Counseling",
    description: "One-on-one guidance for university selection and applications",
    icon: GraduationCap,
    price: "$150",
    duration: "1 hour",
    status: "Active",
    bookings: 45,
  },
  {
    id: 2,
    name: "Visa Filing Assistance",
    description: "Complete visa application preparation and submission support",
    icon: FileText,
    price: "$200",
    duration: "Full service",
    status: "Active",
    bookings: 78,
  },
  {
    id: 3,
    name: "IELTS Preparation",
    description: "Comprehensive IELTS coaching with practice tests",
    icon: BookOpen,
    price: "$300",
    duration: "4 weeks",
    status: "Active",
    bookings: 32,
  },
  {
    id: 4,
    name: "Interview Preparation",
    description: "Mock interviews and visa interview coaching",
    icon: Users,
    price: "$100",
    duration: "2 sessions",
    status: "Active",
    bookings: 28,
  },
  {
    id: 5,
    name: "Pre-Departure Briefing",
    description: "Orientation session for students traveling abroad",
    icon: Plane,
    price: "$50",
    duration: "2 hours",
    status: "Active",
    bookings: 56,
  },
  {
    id: 6,
    name: "Accommodation Assistance",
    description: "Help finding and securing student accommodation",
    icon: Building,
    price: "$100",
    duration: "Consultation",
    status: "Inactive",
    bookings: 15,
  },
];

const Services = () => {
  return (
    <DashboardLayout title="Services" subtitle="Manage consultancy services">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{services.length}</p>
                <p className="text-sm text-muted-foreground">Total Services</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{services.filter((s) => s.status === "Active").length}</p>
                <p className="text-sm text-muted-foreground">Active Services</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{services.reduce((acc, s) => acc + s.bookings, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Service Catalog</CardTitle>
              <p className="text-sm text-muted-foreground">Manage your consultancy offerings</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <Badge
                            variant="outline"
                            className={
                              service.status === "Active"
                                ? "bg-success/10 text-success border-success/20"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {service.status}
                          </Badge>
                        </div>
                      </div>
                      <Switch checked={service.status === "Active"} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-success" />
                          <span className="font-medium">{service.price}</span>
                        </div>
                        <span className="text-muted-foreground">{service.duration}</span>
                      </div>
                      <Badge variant="secondary">{service.bookings} bookings</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Services;
