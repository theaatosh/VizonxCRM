import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MessageSquare } from "lucide-react";
import { EmailTab } from "@/components/settings/EmailTab";
import { SmsTab } from "@/components/settings/SmsTab";

const Messaging = () => {
  return (
    <DashboardLayout title="Messaging" subtitle="Manage email and SMS templates">
      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="sms" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>SMS</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <EmailTab />
        </TabsContent>

        <TabsContent value="sms">
          <SmsTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Messaging;
