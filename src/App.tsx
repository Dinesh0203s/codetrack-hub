import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import UsersPage from "./pages/admin/UsersPage";
import ReportsPage from "./pages/admin/ReportsPage";
import RolesPage from "./pages/admin/RolesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/roles" element={<RolesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
