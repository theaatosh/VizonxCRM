import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, HelpCircle, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// FAQ imports
import { useFaqs, useDeleteFaq, useGroupedFaqs } from '@/hooks/useFaqs';
import { FaqCard } from '@/components/faqs/FaqCard';
import { CreateFaqDialog } from '@/components/faqs/CreateFaqDialog';
import { EditFaqDialog } from '@/components/faqs/EditFaqDialog';
import { FaqDetailModal } from '@/components/faqs/FaqDetailModal';
import { Faq } from '@/types/faq.types';

// Landing Page imports
import { useLandingPages, useDeleteLandingPage } from '@/hooks/useLandingPages';
import { LandingPageCard } from '@/components/landing-pages/LandingPageCard';
import { CreateLandingPageDialog } from '@/components/landing-pages/CreateLandingPageDialog';
import { EditLandingPageDialog } from '@/components/landing-pages/EditLandingPageDialog';
import { LandingPageDetailModal } from '@/components/landing-pages/LandingPageDetailModal';
import { LandingPage } from '@/types/landingPage.types';

const ContentManagement = () => {
    const [activeTab, setActiveTab] = useState('faqs');

    // FAQ state
    const [faqPage, setFaqPage] = useState(1);
    const [faqSearch, setFaqSearch] = useState('');
    const [faqCategory, setFaqCategory] = useState<string>('all');
    const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
    const [editFaq, setEditFaq] = useState<Faq | null>(null);
    const [faqDetailOpen, setFaqDetailOpen] = useState(false);
    const [faqEditOpen, setFaqEditOpen] = useState(false);

    // Landing Page state
    const [lpPage, setLpPage] = useState(1);
    const [lpSearch, setLpSearch] = useState('');
    const [selectedLandingPage, setSelectedLandingPage] = useState<LandingPage | null>(null);
    const [editLandingPage, setEditLandingPage] = useState<LandingPage | null>(null);
    const [lpDetailOpen, setLpDetailOpen] = useState(false);
    const [lpEditOpen, setLpEditOpen] = useState(false);

    const faqLimit = 12;
    const lpLimit = 12;

    // FAQ data fetching
    const {
        data: faqData,
        isLoading: faqLoading,
        isError: faqError,
    } = useFaqs({
        page: faqPage,
        limit: faqLimit,
        search: faqSearch || undefined,
        category: faqCategory !== 'all' ? faqCategory : undefined,
        sortBy: 'sortOrder',
        sortOrder: 'asc',
    });

    const deleteFaqMutation = useDeleteFaq();

    // Landing Page data fetching
    const {
        data: lpData,
        isLoading: lpLoading,
        isError: lpError,
    } = useLandingPages({
        page: lpPage,
        limit: lpLimit,
        search: lpSearch || undefined,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
    });

    const deleteLandingPageMutation = useDeleteLandingPage();

    // FAQ handlers
    const handleViewFaq = (faq: Faq) => {
        setSelectedFaq(faq);
        setFaqDetailOpen(true);
    };

    const handleEditFaq = (faq: Faq) => {
        setEditFaq(faq);
        setFaqEditOpen(true);
    };

    const handleDeleteFaq = (id: string) => {
        deleteFaqMutation.mutate(id);
    };

    // Landing Page handlers
    const handleViewLandingPage = (landingPage: LandingPage) => {
        setSelectedLandingPage(landingPage);
        setLpDetailOpen(true);
    };

    const handleEditLandingPage = (landingPage: LandingPage) => {
        setEditLandingPage(landingPage);
        setLpEditOpen(true);
    };

    const handleDeleteLandingPage = (id: string) => {
        deleteLandingPageMutation.mutate(id);
    };

    // Get unique categories from all FAQs
    // Primary: Use grouped endpoint for all categories
    // Fallback: Extract from current FAQ data if grouped fails
    const { data: groupedFaqsData } = useGroupedFaqs();

    const faqCategories = React.useMemo(() => {
        // Try to get from grouped endpoint first
        if (groupedFaqsData?.data && groupedFaqsData.data.length > 0) {
            return groupedFaqsData.data.map((group) => group.category);
        }

        // Fallback: extract unique categories from current FAQ data
        if (faqData?.data && faqData.data.length > 0) {
            return Array.from(new Set(faqData.data.map((faq) => faq.category)));
        }

        return [];
    }, [groupedFaqsData, faqData]);

    return (
        <DashboardLayout title="Content Management" subtitle="Manage FAQs and Landing Pages">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                    <TabsTrigger value="faqs" className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        FAQs
                    </TabsTrigger>
                    <TabsTrigger value="landing-pages" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Landing Pages
                    </TabsTrigger>
                </TabsList>

                {/* FAQ Tab */}
                <TabsContent value="faqs" className="space-y-4">
                    {/* FAQ Controls */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="flex-1 w-full sm:max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search FAQs..."
                                        value={faqSearch}
                                        onChange={(e) => {
                                            setFaqSearch(e.target.value);
                                            setFaqPage(1);
                                        }}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <CreateFaqDialog />
                        </div>

                        <div className="flex gap-2">
                            <Select value={faqCategory} onValueChange={(value) => {
                                setFaqCategory(value);
                                setFaqPage(1);
                            }}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {faqCategories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* FAQ Loading */}
                    {faqLoading && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="border rounded-lg p-6">
                                    <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-full mb-4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* FAQ Error */}
                    {faqError && (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                            <HelpCircle className="h-12 w-12 text-destructive mb-3" />
                            <p className="text-sm text-muted-foreground">Failed to load FAQs</p>
                        </div>
                    )}

                    {/* FAQ Empty */}
                    {!faqLoading && !faqError && faqData?.data.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                            <HelpCircle className="h-12 w-12 text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground mb-4">
                                {faqSearch || faqCategory !== 'all'
                                    ? 'No FAQs match your filters'
                                    : 'No FAQs created yet'}
                            </p>
                            {!faqSearch && faqCategory === 'all' && <CreateFaqDialog />}
                        </div>
                    )}

                    {/* FAQ Grid */}
                    {!faqLoading && !faqError && faqData && faqData.data.length > 0 && (
                        <>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {faqData.data.map((faq) => (
                                    <FaqCard
                                        key={faq.id}
                                        faq={faq}
                                        onView={handleViewFaq}
                                        onEdit={handleEditFaq}
                                        onDelete={handleDeleteFaq}
                                    />
                                ))}
                            </div>

                            {/* FAQ Pagination */}
                            {faqData.meta.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <Button
                                        variant="outline"
                                        onClick={() => setFaqPage((p) => Math.max(1, p - 1))}
                                        disabled={faqPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Page {faqPage} of {faqData.meta.totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => setFaqPage((p) => Math.min(faqData.meta.totalPages, p + 1))}
                                        disabled={faqPage === faqData.meta.totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    {/* FAQ Modals */}
                    <FaqDetailModal
                        faq={selectedFaq}
                        open={faqDetailOpen}
                        onOpenChange={setFaqDetailOpen}
                    />
                    <EditFaqDialog
                        faq={editFaq}
                        open={faqEditOpen}
                        onOpenChange={setFaqEditOpen}
                    />
                </TabsContent>

                {/* Landing Pages Tab */}
                <TabsContent value="landing-pages" className="space-y-4">
                    {/* Landing Page Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex-1 w-full sm:max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search landing pages..."
                                    value={lpSearch}
                                    onChange={(e) => {
                                        setLpSearch(e.target.value);
                                        setLpPage(1);
                                    }}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <CreateLandingPageDialog />
                    </div>

                    {/* Landing Page Loading */}
                    {lpLoading && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="border rounded-lg p-6">
                                    <Skeleton className="h-32 w-full rounded-lg mb-4" />
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-full mb-4" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Landing Page Error */}
                    {lpError && (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                            <FileText className="h-12 w-12 text-destructive mb-3" />
                            <p className="text-sm text-muted-foreground">Failed to load landing pages</p>
                        </div>
                    )}

                    {/* Landing Page Empty */}
                    {!lpLoading && !lpError && lpData?.data.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground mb-4">
                                {lpSearch ? 'No landing pages match your search' : 'No landing pages created yet'}
                            </p>
                            {!lpSearch && <CreateLandingPageDialog />}
                        </div>
                    )}

                    {/* Landing Page Grid */}
                    {!lpLoading && !lpError && lpData && lpData.data.length > 0 && (
                        <>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {lpData.data.map((landingPage) => (
                                    <LandingPageCard
                                        key={landingPage.id}
                                        landingPage={landingPage}
                                        onView={handleViewLandingPage}
                                        onEdit={handleEditLandingPage}
                                        onDelete={handleDeleteLandingPage}
                                    />
                                ))}
                            </div>

                            {/* Landing Page Pagination */}
                            {lpData.meta.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <Button
                                        variant="outline"
                                        onClick={() => setLpPage((p) => Math.max(1, p - 1))}
                                        disabled={lpPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Page {lpPage} of {lpData.meta.totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => setLpPage((p) => Math.min(lpData.meta.totalPages, p + 1))}
                                        disabled={lpPage === lpData.meta.totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Landing Page Modals */}
                    <LandingPageDetailModal
                        landingPage={selectedLandingPage}
                        open={lpDetailOpen}
                        onOpenChange={setLpDetailOpen}
                    />
                    <EditLandingPageDialog
                        landingPage={editLandingPage}
                        open={lpEditOpen}
                        onOpenChange={setLpEditOpen}
                    />
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
};

export default ContentManagement;
