import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, Globe, Building2, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import { useCountries } from '@/hooks/useCountries';
import { usePermissions } from '@/contexts/PermissionContext';
import { CountryFormDialog } from '@/components/countries/CountryFormDialog';
import { DeleteCountryDialog } from '@/components/countries/DeleteCountryDialog';
import type { Country } from '@/types/country.types';

const Countries = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Fetch countries from API
  const { data, isLoading, isError, error } = useCountries({
    page,
    limit: 12,
    search: searchQuery || undefined,
    sortOrder: 'asc',
    sortBy: 'name',
  });

  const { canCreate, canUpdate, canDelete } = usePermissions();

  // Handlers
  const handleAddCountry = () => {
    setSelectedCountry(null);
    setFormDialogOpen(true);
  };

  const handleEditCountry = (country: Country) => {
    setSelectedCountry(country);
    setFormDialogOpen(true);
  };

  const handleDeleteCountry = (country: Country) => {
    setSelectedCountry(country);
    setDeleteDialogOpen(true);
  };

  const handleViewDetails = (country: Country) => {
    navigate(`/countries/${country.id}`);
  };

  // Flag emoji helper (based on country code)
  const getCountryFlag = (code: string): string => {
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 0x1F1E6 + char.charCodeAt(0) - 65);
    return String.fromCodePoint(...codePoints);
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <>
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="shadow-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent pb-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </>
  );

  return (
    <DashboardLayout title="Countries" subtitle="Manage countries and visa requirements">
      <Card className="shadow-card mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Countries Database</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total: {data?.meta?.total || 0} countries
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search countries..."
                  className="pl-9 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              {canCreate('countries') && (
                <Button className="gap-2" onClick={handleAddCountry}>
                  <Plus className="h-4 w-4" />
                  Add Country
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Error State */}
      {isError && (
        <Card className="shadow-card">
          <CardContent className="py-8 text-center">
            <p className="text-destructive">
              Failed to load countries: {error?.message || 'Unknown error'}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Countries Grid */}
      {!isError && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <LoadingSkeleton />
          ) : !data?.data?.length ? (
            <div className="col-span-3 py-12 text-center">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'No countries found matching your search.'
                  : 'No countries yet. Click "Add Country" to create one.'}
              </p>
            </div>
          ) : (
            data.data.map((country) => (
              <Card
                key={country.id}
                className="shadow-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleViewDetails(country)}
              >
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-background/80 flex items-center justify-center text-2xl shadow-sm">
                        {getCountryFlag(country.code)}
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {country.name}
                        </CardTitle>
                        <Badge variant="outline" className="font-mono text-xs mt-1">
                          {country.code}
                        </Badge>
                      </div>
                    </div>
                    {(canUpdate('countries') || canDelete('countries')) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(country);
                          }}>
                            View Details
                          </DropdownMenuItem>
                          {canUpdate('countries') && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleEditCountry(country);
                            }}>
                              Edit
                            </DropdownMenuItem>
                          )}
                          {canDelete('countries') && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCountry(country);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {country.isActive ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {country.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={country.isActive
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-muted text-muted-foreground'
                      }
                    >
                      {country.isActive ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>View universities and visa types</span>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(country);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.meta.totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <CountryFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        country={selectedCountry}
      />

      <DeleteCountryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        country={selectedCountry}
      />
    </DashboardLayout>
  );
};

export default Countries;
