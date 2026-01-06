import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Leads from "./pages/Leads";
import Visas from "./pages/Visas";
import Vacancies from "./pages/Vacancies";
import Applicants from "./pages/Applicants";
import Countries from "./pages/Countries";
import Appointments from "./pages/Appointments";
import Workflow from "./pages/Workflow";
import Tasks from "./pages/Tasks";
import Scholarships from "./pages/Scholarships";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/visas" element={<Visas />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/applicants" element={<Applicants />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/services" element={<Services />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
