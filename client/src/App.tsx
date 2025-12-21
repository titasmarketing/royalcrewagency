import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCalendar from "./pages/AdminCalendar";
import AdminServices from "./pages/AdminServices";
import AdminStaff from "./pages/AdminStaff";
import AdminClients from "./pages/AdminClients";
import AdminInventory from "./pages/AdminInventory";
import AdminDocuments from "./pages/AdminDocuments";
import AdminMatchmaking from "./pages/AdminMatchmaking";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import ClientPortal from "./pages/ClientPortal";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/calendar"} component={AdminCalendar} />
      <Route path={"/admin/services"} component={AdminServices} />
      <Route path={"/admin/staff"} component={AdminStaff} />
      <Route path={"/admin/clients"} component={AdminClients} />
      <Route path={"/admin/inventory"} component={AdminInventory} />
      <Route path={"/admin/documents"} component={AdminDocuments} />
      <Route path={"/admin/matchmaking"} component={AdminMatchmaking} />
      <Route path={"/servicos"} component={Services} />
      <Route path={"/servicos/:slug"} component={ServiceDetail} />
      <Route path={"/cliente"} component={ClientPortal} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
