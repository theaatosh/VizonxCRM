import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  Users,
  Plus,
  Settings,
  DollarSign,
  Package,
  AlertCircle,
  MoreVertical,
  Pencil,
  Trash2
} from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { ServiceFormDialog } from "@/components/services/ServiceFormDialog";
import { DeleteServiceDialog } from "@/components/services/DeleteServiceDialog";
import type { Service } from "@/types/service.types";

const Services = () => {
  const { data, isLoading, isError } = useServices({ limit: 20 });

  const services = data?.data || [];
  const totalServices = data?.meta?.total || 0;

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handle add new service
  const handleAddService = () => {
    setSelectedService(null);
    setFormDialogOpen(true);
  };

  // Handle edit service
  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setFormDialogOpen(true);
  };

  // Handle delete service
  const handleDeleteService = (service: Service) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  // Loading skeleton for stats
  const StatSkeleton = () => (
    <Skeleton className="h-8 w-16 mb-1" />
  );

  // Loading skeleton for service cards
  const ServiceCardSkeleton = () => (
    <Card className="border border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout title="Services" subtitle="Manage consultancy services">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                {isLoading ? <StatSkeleton /> : (
                  <p className="text-2xl font-bold">{totalServices}</p>
                )}
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
                {isLoading ? <StatSkeleton /> : (
                  <p className="text-2xl font-bold">{services.length}</p>
                )}
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
                {isLoading ? <StatSkeleton /> : (
                  <p className="text-2xl font-bold">
                    {services.reduce((acc, s) => acc + s.price, 0) > 0
                      ? formatPrice(services.reduce((acc, s) => acc + s.price, 0))
                      : '$0'}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Total Value</p>
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
            <Button className="gap-2" onClick={handleAddService}>
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Error State */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load services</h3>
              <p className="text-sm text-muted-foreground mb-4">
                An error occurred while fetching services
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && services.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No services found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by creating your first service
              </p>
              <Button className="gap-2" onClick={handleAddService}>
                <Plus className="h-4 w-4" />
                Add Service
              </Button>
            </div>
          )}

          {/* Services Grid */}
          {!isLoading && !isError && services.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service: Service) => (
                <Card key={service.id} className="border border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <Badge
                            variant="outline"
                            className="bg-success/10 text-success border-success/20"
                          >
                            Active
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditService(service)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteService(service)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {service.description || "No description provided"}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-success" />
                        <span className="font-medium">{formatPrice(service.price)}</span>
                      </div>
                      <Badge variant="secondary">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ServiceFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        service={selectedService}
      />
      <DeleteServiceDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        service={selectedService}
      />
    </DashboardLayout>
  );
};

export default Services;
