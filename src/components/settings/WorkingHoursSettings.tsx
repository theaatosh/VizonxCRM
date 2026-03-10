import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Clock, CalendarDays } from "lucide-react";
import workingHoursService, { WorkingHour } from "@/services/workingHours.service";

const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

// Helper to convert local HH:mm to UTC HH:mm
const localToUTC = (time: string) => {
    if (!time) return "00:00";
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    const utcHours = date.getUTCHours().toString().padStart(2, '0');
    const utcMinutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${utcHours}:${utcMinutes}`;
};

// Helper to convert UTC HH:mm to local HH:mm
const utcToLocal = (utcTime: string) => {
    if (!utcTime) return "09:00";
    const [hours, minutes] = utcTime.split(':').map(Number);
    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0);
    const localHours = date.getHours().toString().padStart(2, '0');
    const localMinutes = date.getMinutes().toString().padStart(2, '0');
    return `${localHours}:${localMinutes}`;
};

export const WorkingHoursSettings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);

    useEffect(() => {
        fetchWorkingHours();
    }, []);

    const fetchWorkingHours = async () => {
        try {
            const data = await workingHoursService.getAllWorkingHours();
            setWorkingHours(data);
        } catch (error) {
            console.error("Error fetching working hours:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load working hours.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (day: string, isOpen: boolean) => {
        setWorkingHours((prev) => {
            const existing = prev.find((wh) => wh.dayOfWeek === day);
            if (existing) {
                return prev.map((wh) =>
                    wh.dayOfWeek === day ? { ...wh, isOpen } : wh
                );
            } else {
                // Initialize with local 09:00 and 17:00, converted to UTC for state
                return [...prev, {
                    dayOfWeek: day,
                    isOpen,
                    openTime: localToUTC("09:00"),
                    closeTime: localToUTC("17:00")
                }];
            }
        });
    };

    const handleTimeChange = (day: string, field: "openTime" | "closeTime", localValue: string) => {
        const utcValue = localToUTC(localValue);
        setWorkingHours((prev) => {
            const existing = prev.find((wh) => wh.dayOfWeek === day);
            if (existing) {
                return prev.map((wh) =>
                    wh.dayOfWeek === day ? { ...wh, [field]: utcValue } : wh
                );
            } else {
                const newEntry = {
                    dayOfWeek: day,
                    isOpen: true,
                    openTime: field === "openTime" ? utcValue : localToUTC("09:00"),
                    closeTime: field === "closeTime" ? utcValue : localToUTC("17:00"),
                };
                return [...prev, newEntry];
            }
        });
    };

    const handleSave = async (day: string) => {
        const data = workingHours.find((wh) => wh.dayOfWeek === day);
        if (!data) return;

        setSaving(true);
        try {
            await workingHoursService.createWorkingHour({
                dayOfWeek: data.dayOfWeek,
                isOpen: data.isOpen,
                openTime: data.openTime,
                closeTime: data.closeTime,
            });
            toast({
                title: "Success",
                description: `Working hours for ${day} saved successfully.`,
            });
            fetchWorkingHours();
        } catch (error) {
            console.error("Error saving working hours:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to save working hours for ${day}.`,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            await Promise.all(
                workingHours.map((wh) =>
                    workingHoursService.createWorkingHour({
                        dayOfWeek: wh.dayOfWeek,
                        isOpen: wh.isOpen,
                        openTime: wh.openTime,
                        closeTime: wh.closeTime,
                    })
                )
            );
            toast({
                title: "Success",
                description: "All working hours saved successfully.",
            });
            fetchWorkingHours();
        } catch (error) {
            console.error("Error saving all working hours:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save some working hours.",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Card className="shadow-card border-none bg-background/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <Clock className="h-6 w-6 text-primary" />
                        Working Hours
                    </CardTitle>
                    <CardDescription>
                        Set your business hours for each day of the week (Local Time).
                    </CardDescription>
                </div>
                <Button onClick={handleSaveAll} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save All
                </Button>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {daysOfWeek.map((day) => {
                        const data = workingHours.find((wh) => wh.dayOfWeek === day) || {
                            dayOfWeek: day,
                            isOpen: false,
                            openTime: localToUTC("09:00"),
                            closeTime: localToUTC("17:00"),
                        };

                        return (
                            <div
                                key={day}
                                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border bg-card/40 hover:bg-card/60 transition-all duration-200 gap-4"
                            >
                                <div className="flex items-center gap-4 min-w-[150px]">
                                    <div className={`p-2 rounded-lg ${data.isOpen ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        <CalendarDays className="h-5 w-5" />
                                    </div>
                                    <Label className="text-base font-semibold">{day}</Label>
                                </div>

                                <div className="flex items-center gap-8 flex-1 justify-end">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-medium ${data.isOpen ? 'text-primary' : 'text-muted-foreground'}`}>
                                            {data.isOpen ? "Open" : "Closed"}
                                        </span>
                                        <Switch
                                            checked={data.isOpen}
                                            onCheckedChange={(checked) => handleToggle(day, checked)}
                                        />
                                    </div>

                                    <div className={`flex items-center gap-3 transition-opacity duration-200 ${data.isOpen ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="time"
                                                value={utcToLocal(data.openTime)}
                                                onChange={(e) => handleTimeChange(day, "openTime", e.target.value)}
                                                className="w-[110px] bg-background/50 border-muted-foreground/20"
                                            />
                                            <span className="text-muted-foreground">to</span>
                                            <Input
                                                type="time"
                                                value={utcToLocal(data.closeTime)}
                                                onChange={(e) => handleTimeChange(day, "closeTime", e.target.value)}
                                                className="w-[110px] bg-background/50 border-muted-foreground/20"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleSave(day)}
                                        disabled={saving}
                                        className="hidden md:flex text-primary hover:text-primary hover:bg-primary/10"
                                    >
                                        <Save className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
