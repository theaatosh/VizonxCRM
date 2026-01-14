import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    MoreHorizontal,
    ExternalLink,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { useCountry, useCountryUniversities, useCountryVisaTypes } from '@/hooks/useCountries';
import { useDeleteUniversity, useUniversityCourses } from '@/hooks/useUniversities';
import { CountryFormDialog } from '@/components/countries/CountryFormDialog';
import { DeleteCountryDialog } from '@/components/countries/DeleteCountryDialog';
import { UniversityFormDialog } from '@/components/countries/UniversityFormDialog';
import { UniversityCoursesDialog } from '@/components/countries/UniversityCoursesDialog';
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
    const [coursesDialogOpen, setCoursesDialogOpen] = useState(false);
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
                    <Card className="shadow-card">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle className="text-lg">Universities</CardTitle>
                                    <p className="text-sm text-muted-foreground">
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
                        <CardContent>
                            <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead>University</TableHead>
                                            <TableHead>Ranking</TableHead>
                                            <TableHead>Website</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {uniLoading ? (
                                            [...Array(5)].map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : !universitiesData?.data?.length ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center">
                                                    <p className="text-muted-foreground">
                                                        No universities found. Click "Add University" to create one.
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            universitiesData.data.map((uni) => (
                                                <TableRow key={uni.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{uni.name}</p>
                                                            {uni.description && (
                                                                <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                                                                    {uni.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {uni.ranking ? (
                                                            <Badge variant="outline">#{uni.ranking}</Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {uni.website ? (
                                                            <a
                                                                href={uni.website}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary hover:underline flex items-center gap-1"
                                                            >
                                                                Visit <ExternalLink className="h-3 w-3" />
                                                            </a>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={uni.isActive
                                                                ? 'bg-success/10 text-success border-success/20'
                                                                : 'bg-muted text-muted-foreground'
                                                            }
                                                        >
                                                            {uni.isActive ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleEditUniversity(uni)}>
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => {
                                                                    setSelectedUniversity(uni);
                                                                    setCoursesDialogOpen(true);
                                                                }}>
                                                                    Manage Courses
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-destructive"
                                                                    onClick={() => handleDeleteUniversity(uni)}
                                                                >
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {universitiesData?.meta && universitiesData.meta.totalPages > 1 && (
                                <div className="mt-4 flex items-center justify-between">
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
                        </CardContent>
                    </Card>
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

            <UniversityCoursesDialog
                open={coursesDialogOpen}
                onOpenChange={setCoursesDialogOpen}
                university={selectedUniversity}
            />
        </DashboardLayout>
    );
};

export default CountryDetail;
