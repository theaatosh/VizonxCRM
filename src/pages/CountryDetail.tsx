import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    Globe,
    Building2,
    GraduationCap,
    Plus,
    Search,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { useCountry, useCountryUniversities, useCountryVisaTypes } from '@/hooks/useCountries';
import { useDeleteUniversity } from '@/hooks/useUniversities';
import { CountryFormDialog } from '@/components/countries/CountryFormDialog';
import { DeleteCountryDialog } from '@/components/countries/DeleteCountryDialog';
import { UniversityFormDialog } from '@/components/countries/UniversityFormDialog';
import { UniversityCard, UniversityCardSkeleton } from '@/components/countries/UniversityCard';
import type { University } from '@/types/university.types';

const CountryDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [uniPage, setUniPage] = useState(1);

    // Dialog states
    const [editCountryDialogOpen, setEditCountryDialogOpen] = useState(false);
    const [deleteCountryDialogOpen, setDeleteCountryDialogOpen] = useState(false);
    const [universityDialogOpen, setUniversityDialogOpen] = useState(false);
    const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

    // Fetch data
    const { data: country, isLoading, isError, error } = useCountry(id || '');
    const {
        data: universitiesData,
        isLoading: uniLoading
    } = useCountryUniversities(id || '', {
        page: uniPage,
        limit: 10,
        search: searchQuery || undefined,
    });
    const { data: visaTypes } = useCountryVisaTypes(id || '');

    const deleteUniversity = useDeleteUniversity();

    // Handlers
    const handleAddUniversity = () => {
        setSelectedUniversity(null);
        setUniversityDialogOpen(true);
    };

    const handleEditUniversity = (uni: University) => {
        setSelectedUniversity(uni);
        setUniversityDialogOpen(true);
    };

    const handleDeleteUniversity = async (uni: University) => {
        if (confirm(`Are you sure you want to delete ${uni.name}?`)) {
            await deleteUniversity.mutateAsync(uni.id);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <DashboardLayout title="Country Details" subtitle="Loading...">
                <div className="space-y-6">
                    <Skeleton className="h-10 w-32" />
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-2">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <Skeleton className="h-8 w-48" />
                                    <Skeleton className="h-4 w-64" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <Skeleton className="h-32 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Error state
    if (isError || !country) {
        return (
            <DashboardLayout title="Country Details" subtitle="Error">
                <Card className="shadow-card">
                    <CardContent className="p-8 text-center">
                        <p className="text-destructive mb-4">
                            {error?.message || 'Failed to load country details'}
                        </p>
                        <Button onClick={() => navigate('/countries')} variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Countries
                        </Button>
                    </CardContent>
                </Card>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title={country.name}
            subtitle={`Country Code: ${country.code}`}
        >
            {/* Back Button */}
            <Button
                variant="ghost"
                className="mb-6 gap-2"
                onClick={() => navigate('/countries')}
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Countries
            </Button>

            {/* Header Card */}
            <Card className="shadow-card mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 via-accent/50 to-primary/5 p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl shadow-inner">
                                <Globe className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{country.name}</h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <Badge variant="outline" className="font-mono">
                                        {country.code}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={country.isActive
                                            ? 'bg-success/10 text-success border-success/20'
                                            : 'bg-muted text-muted-foreground'
                                        }
                                    >
                                        {country.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditCountryDialogOpen(true)}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Country
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => setDeleteCountryDialogOpen(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-t">
                    <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-primary">
                            {universitiesData?.meta?.total || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Universities</p>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-primary">
                            {Array.isArray(visaTypes) ? visaTypes.length : 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Visa Types</p>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-primary">
                            {country.isActive ? <CheckCircle className="h-6 w-6 mx-auto text-success" /> : <XCircle className="h-6 w-6 mx-auto text-muted-foreground" />}
                        </p>
                        <p className="text-sm text-muted-foreground">Status</p>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-sm font-medium text-foreground">
                            {new Date(country.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Created</p>
                    </div>
                </div>
            </Card>

            {/* Tabs for Universities and Visa Types */}
            <Tabs defaultValue="universities" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="universities" className="gap-2">
                        <Building2 className="h-4 w-4" />
                        Universities
                    </TabsTrigger>
                    <TabsTrigger value="visa-types" className="gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Visa Types
                    </TabsTrigger>
                </TabsList>

                {/* Universities Tab */}
                <TabsContent value="universities">
                    {/* Universities Header */}
                    <Card className="shadow-card mb-6">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-primary" />
                                        Universities
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {universitiesData?.meta?.total || 0} universities in {country.name}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search universities..."
                                            className="pl-9 w-[250px]"
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setUniPage(1);
                                            }}
                                        />
                                    </div>
                                    <Button className="gap-2" onClick={handleAddUniversity}>
                                        <Plus className="h-4 w-4" />
                                        Add University
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Universities Grid */}
                    <div className="space-y-4">
                        {uniLoading ? (
                            // Loading skeletons
                            [...Array(3)].map((_, i) => (
                                <UniversityCardSkeleton key={i} />
                            ))
                        ) : !universitiesData?.data?.length ? (
                            // Empty state
                            <Card className="shadow-card">
                                <CardContent className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Building2 className="h-8 w-8 text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg">No Universities Yet</h3>
                                            <p className="text-muted-foreground text-sm max-w-sm">
                                                {searchQuery
                                                    ? `No universities found matching "${searchQuery}"`
                                                    : 'Start building your university catalog by adding the first university.'
                                                }
                                            </p>
                                        </div>
                                        {!searchQuery && (
                                            <Button className="gap-2 mt-2" onClick={handleAddUniversity}>
                                                <Plus className="h-4 w-4" />
                                                Add First University
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            // University cards
                            universitiesData.data.map((uni) => (
                                <UniversityCard
                                    key={uni.id}
                                    university={uni}
                                    onEdit={handleEditUniversity}
                                    onDelete={handleDeleteUniversity}
                                />
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {universitiesData?.meta && universitiesData.meta.totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Page {universitiesData.meta.page} of {universitiesData.meta.totalPages}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setUniPage((p) => Math.max(1, p - 1))}
                                    disabled={uniPage === 1 || uniLoading}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setUniPage((p) => p + 1)}
                                    disabled={uniPage >= universitiesData.meta.totalPages || uniLoading}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Visa Types Tab */}
                <TabsContent value="visa-types">
                    <Card className="shadow-card">
                        <CardHeader>
                            <CardTitle className="text-lg">Visa Types</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Available visa types for {country.name}
                            </p>
                        </CardHeader>
                        <CardContent>
                            {Array.isArray(visaTypes) && visaTypes.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {visaTypes.map((visa: { id?: string; name?: string; description?: string }, index) => (
                                        <Card key={visa.id || index} className="border">
                                            <CardContent className="p-4">
                                                <h4 className="font-medium">{visa.name || 'Unnamed Visa'}</h4>
                                                {visa.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {visa.description}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">
                                        No visa types configured for this country.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <CountryFormDialog
                open={editCountryDialogOpen}
                onOpenChange={setEditCountryDialogOpen}
                country={country}
            />

            <DeleteCountryDialog
                open={deleteCountryDialogOpen}
                onOpenChange={(open) => {
                    setDeleteCountryDialogOpen(open);
                    if (!open) navigate('/countries');
                }}
                country={country}
            />

            <UniversityFormDialog
                open={universityDialogOpen}
                onOpenChange={setUniversityDialogOpen}
                university={selectedUniversity}
                countryId={country.id}
            />
        </DashboardLayout>
    );
};

export default CountryDetail;
