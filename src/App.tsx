import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
          <Route path="/visas" element={<ProtectedRoute><Visas /></ProtectedRoute>} />
          <Route path="/applicants" element={<ProtectedRoute><Applicants /></ProtectedRoute>} />
          <Route path="/applicants/:id" element={<ProtectedRoute><ApplicantDetail /></ProtectedRoute>} />
          <Route path="/countries" element={<ProtectedRoute><Countries /></ProtectedRoute>} />
          <Route path="/countries/:id" element={<ProtectedRoute><CountryDetail /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/workflow" element={<ProtectedRoute><Workflow /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/scholarships" element={<ProtectedRoute><Scholarships /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/content-management" element={<ProtectedRoute><ContentManagement /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
