import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import SaasRegister from "@/pages/saas-register";
import Onboarding from "@/pages/onboarding";
import CompanySetup from "@/pages/company-setup";
import DashboardLayout from "@/components/layout/dashboard-layout";
import Dashboard from "@/pages/dashboard";
import Tickets from "@/pages/tickets";
import Customers from "@/pages/customers";
import HourBank from "@/pages/hour-bank";
import KnowledgeBase from "@/pages/knowledge-base";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import Subscribe from "@/pages/subscribe";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/saas-register" component={SaasRegister} />
          <Route path="/company-setup" component={CompanySetup} />
          <Route path="/subscribe" component={Subscribe} />
        </>
      ) : !user?.tenantId ? (
        <Route path="/" component={Onboarding} />
      ) : (
        <DashboardLayout>
          <Route path="/" component={Dashboard} />
          <Route path="/tickets" component={Tickets} />
          <Route path="/customers" component={Customers} />
          <Route path="/hour-bank" component={HourBank} />
          <Route path="/knowledge-base" component={KnowledgeBase} />
          <Route path="/reports" component={Reports} />
          <Route path="/settings" component={Settings} />
        </DashboardLayout>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}

export default App;
