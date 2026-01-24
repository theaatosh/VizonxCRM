import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PermissionProvider } from "./contexts/PermissionContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Index from "./pages/Index";
import Leads from "./pages/Leads";
import Visas from "./pages/Visas";
import Vacancies from "./pages/Vacancies";
import Applicants from "./pages/Applicants";
import ApplicantDetail from "./pages/ApplicantDetail";
import Countries from "./pages/Countries";
import CountryDetail from "./pages/CountryDetail";
import Appointments from "./pages/Appointments";
import Workflow from "./pages/Workflow";
import Tasks from "./pages/Tasks";
import Scholarships from "./pages/Scholarships";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import ContentManagement from "./pages/ContentManagement";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import NotificationsPage from "./pages/notifications/NotificationsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PermissionProvider>
          <NotificationProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes with Module Permissions */}
              <Route path="/" element={<ProtectedRoute module="dashboard"><Index /></ProtectedRoute>} />
              <Route path="/leads" element={<ProtectedRoute module="leads"><Leads /></ProtectedRoute>} />
              <Route path="/visas" element={<ProtectedRoute module="visa-types"><Visas /></ProtectedRoute>} />
              <Route path="/applicants" element={<ProtectedRoute module="students"><Applicants /></ProtectedRoute>} />
              <Route path="/applicants/:id" element={<ProtectedRoute module="students"><ApplicantDetail /></ProtectedRoute>} />
              <Route path="/countries" element={<ProtectedRoute module="countries"><Countries /></ProtectedRoute>} />
              <Route path="/countries/:id" element={<ProtectedRoute module="countries"><CountryDetail /></ProtectedRoute>} />
              <Route path="/appointments" element={<ProtectedRoute module="appointments"><Appointments /></ProtectedRoute>} />
              <Route path="/workflow" element={<ProtectedRoute module="workflows"><Workflow /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute module="tasks"><Tasks /></ProtectedRoute>} />
              <Route path="/scholarships" element={<ProtectedRoute module="scholarships"><Scholarships /></ProtectedRoute>} />
              <Route path="/services" element={<ProtectedRoute module="services"><Services /></ProtectedRoute>} />
              <Route path="/content-management" element={<ProtectedRoute module="blogs"><ContentManagement /></ProtectedRoute>} />
              <Route path="/content-management" element={<ProtectedRoute module="blogs"><ContentManagement /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationProvider>
        </PermissionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
