import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    Users,
    Calendar,
    User,
    GraduationCap,
    BookOpen,
    Clock,
    AlertCircle,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useClass, useClassStudents, useClassBookingRequests } from '@/hooks/useClasses';
import { useState } from 'react';
import { DataTablePagination } from '@/components/shared/DataTablePagination';

const ClassDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // Students state
    const [studentPage, setStudentPage] = useState(1);
    const [studentLimit, setStudentLimit] = useState(10);
    
    // Bookings state
    const [bookingPage, setBookingPage] = useState(1);
    const [bookingLimit, setBookingLimit] = useState(10);

    const { data: classData, isLoading: isClassLoading, isError: isClassError } = useClass(id || '');
    
    const { 
        data: studentsData, 
        isLoading: isStudentsLoading 
    } = useClassStudents(id || '', { page: studentPage, limit: studentLimit });
    
    const { 
        data: bookingsData, 
        isLoading: isBookingsLoading 
    } = useClassBookingRequests(id || '', { page: bookingPage, limit: bookingLimit });

    if (isClassLoading) {
        return (
            <DashboardLayout title="Class Details" subtitle="Loading class information...">
                <div className="space-y-6">
                    <Skeleton className="h-40 w-full rounded-xl" />
                    <div className="grid gap-6 md:grid-cols-3">
                        <Skeleton className="h-24 rounded-xl" />
                        <Skeleton className="h-24 rounded-xl" />
                        <Skeleton className="h-24 rounded-xl" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (isClassError || !classData) {
        return (
            <DashboardLayout title="Error" subtitle="Class not found">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Class Not Found</h2>
                    <p className="text-muted-foreground mb-6">The class you are looking for does not exist or has been removed.</p>
                    <Button onClick={() => navigate('/services')}>Back to Services</Button>
                </div>
            </DashboardLayout>
        );
    }

    const enrolledCount = classData._count?.enrollments || 0;
    const bookingCount = classData._count?.bookingRequests || 0;
    const capacity = classData.studentCapacity;
    const remaining = capacity - enrolledCount;

    return (
        <DashboardLayout 
            title={classData.name} 
            subtitle="Manage enrollments and booking requests"
            action={
                <Button variant="outline" onClick={() => navigate('/services')} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Services
                </Button>
            }
        >
            <div className="space-y-6">
                {/* Class Overview Header Card */}
                <Card className="shadow-card border-none bg-primary/5 dark:bg-primary/10 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 md:items-center">
                            <div className="h-20 w-20 rounded-2xl bg-primary/20 flex items-center justify-center">
                                <BookOpen className="h-10 w-10 text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-3xl font-bold tracking-tight">{classData.name}</h1>
                                    <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
                                </div>
                                <p className="text-muted-foreground max-w-2xl">
                                    {classData.description || "Comprehensive academic class focused on student success and expertise development."}
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                                        <User className="h-4 w-4" />
                                        Instructor: {classData.instructorName || 'Not Assigned'}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        Created: {new Date(classData.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stat Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="shadow-sm border-none bg-background/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Student Capacity</p>
                                    <p className="text-2xl font-bold">{capacity}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-info/10">
                                    <Users className="h-6 w-6 text-info" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-none bg-background/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Currently Enrolled</p>
                                    <p className="text-2xl font-bold">{enrolledCount}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-success/10">
                                    <CheckCircle2 className="h-6 w-6 text-success" />
                                </div>
                            </div>
                            <div className="mt-2 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                <div 
                                    className="bg-success h-full" 
                                    style={{ width: `${Math.min((enrolledCount / capacity) * 100, 100)}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-none bg-background/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Remaining Spots</p>
                                    <p className="text-2xl font-bold">{remaining > 0 ? remaining : 0}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-warning/10">
                                    <GraduationCap className="h-6 w-6 text-warning" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* detail Tabs */}
                <Tabs defaultValue="students" className="space-y-6">
                    <TabsList className="bg-muted/50 p-1 rounded-xl">
                        <TabsTrigger value="students" className="rounded-lg px-6 gap-2">
                            <Users className="h-4 w-4" />
                            Enrolled Students
                            {enrolledCount > 0 && (
                                <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary border-none text-[10px] h-4 min-w-[16px] px-1 justify-center">
                                    {enrolledCount}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="bookings" className="rounded-lg px-6 gap-2">
                            <Clock className="h-4 w-4" />
                            Booking Requests
                            {bookingCount > 0 && (
                                <Badge variant="secondary" className="ml-1 bg-warning/10 text-warning border-none text-[10px] h-4 min-w-[16px] px-1 justify-center">
                                    {bookingCount}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="students" className="animate-in fade-in-50 duration-300">
                        <Card className="shadow-card border-none bg-background/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Class Roster</CardTitle>
                                <CardDescription>All students currently enrolled in this class session</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-xl border border-border overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead className="font-semibold">Student Name</TableHead>
                                                <TableHead className="font-semibold">Email</TableHead>
                                                <TableHead className="font-semibold">Enrollment Date</TableHead>
                                                <TableHead className="font-semibold">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isStudentsLoading ? (
                                                Array.from({ length: 5 }).map((_, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell colSpan={4}><Skeleton className="h-10 w-full" /></TableCell>
                                                    </TableRow>
                                                ))
                                            ) : studentsData?.data.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                                        <div className="flex flex-col items-center">
                                                            <Users className="h-8 w-8 opacity-20 mb-2" />
                                                            <p>No students enrolled yet</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                studentsData?.data.map((item: any) => {
                                                    const student = item.student || item; // Handle direct student or enrollment object
                                                    return (
                                                        <TableRow key={item.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/applicants/${student.id}`)}>
                                                            <TableCell className="font-medium">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
                                                                        {student.firstName?.[0]}{student.lastName?.[0]}
                                                                    </div>
                                                                    {student.firstName} {student.lastName}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground">{student.email}</TableCell>
                                                            <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Active</Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {studentsData && (
                                    <div className="mt-4">
                                        <DataTablePagination
                                            pageIndex={studentPage}
                                            pageSize={studentLimit}
                                            totalItems={studentsData.total}
                                            totalPages={studentsData.totalPages}
                                            onPageChange={setStudentPage}
                                            onPageSizeChange={setStudentLimit}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="bookings" className="animate-in fade-in-50 duration-300">
                        <Card className="shadow-card border-none bg-background/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Pending Requests</CardTitle>
                                <CardDescription>Students who have requested to join this class</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-xl border border-border overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead className="font-semibold">Student Name</TableHead>
                                                <TableHead className="font-semibold">Request Date</TableHead>
                                                <TableHead className="font-semibold">Status</TableHead>
                                                <TableHead className="font-semibold text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isBookingsLoading ? (
                                                Array.from({ length: 3 }).map((_, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell colSpan={4}><Skeleton className="h-10 w-full" /></TableCell>
                                                    </TableRow>
                                                ))
                                            ) : bookingsData?.data.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                                        <div className="flex flex-col items-center">
                                                            <Clock className="h-8 w-8 opacity-20 mb-2" />
                                                            <p>No pending booking requests</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                bookingsData?.data.map((request: any) => (
                                                    <TableRow key={request.id}>
                                                        <TableCell className="font-medium">
                                                            {request.student?.firstName} {request.student?.lastName}
                                                        </TableCell>
                                                        <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20 capitalize">
                                                                {request.status.toLowerCase()}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:bg-success/10">
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                                                    <XCircle className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {bookingsData && (
                                    <div className="mt-4">
                                        <DataTablePagination
                                            pageIndex={bookingPage}
                                            pageSize={bookingLimit}
                                            totalItems={bookingsData.total}
                                            totalPages={bookingsData.totalPages}
                                            onPageChange={setBookingPage}
                                            onPageSizeChange={setBookingLimit}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default ClassDetail;
