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
import ClientEvents from "./pages/admin/ClientEvents";
import AdminInventory from "./pages/AdminInventory";
import AdminDocuments from "./pages/AdminDocuments";
import AdminMatchmaking from "./pages/AdminMatchmaking";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import ClientPortal from "./pages/ClientPortal";
import StaffAvailability from "./pages/StaffAvailability";
import StaffWallet from "./pages/StaffWallet";
import ClientEventStatus from "./pages/ClientEventStatus";
import ClientFinancial from "./pages/ClientFinancial";
import ClientEventDetails from "./pages/ClientEventDetails";
import RecruitmentPortal from "./pages/RecruitmentPortal";
import AdminRecruitment from "./pages/AdminRecruitment";
import StaffPortal from "./pages/StaffPortal";
import AdminPartnerCompanies from "./pages/admin/AdminPartnerCompanies";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminMenu from "./pages/admin/AdminMenu";
import EventDetails from "./pages/admin/EventDetails";
import AdminEventTracking from "./pages/admin/AdminEventTracking";
import AdminStaffMap from "./pages/admin/AdminStaffMap";
import Gallery from "./pages/Gallery";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InstallApp from "./pages/InstallApp";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/admin"}>
        {() => {
          window.location.href = "/admin/calendar";
          return null;
        }}
      </Route>
      <Route path={"/admin/calendar"} component={AdminCalendar} />
      <Route path={"/admin/services"} component={AdminServices} />
      <Route path={"/admin/staff"} component={AdminStaff} />
      <Route path={"/admin/clients"} component={AdminClients} />
      <Route path={"/admin/clients/:id/events"} component={ClientEvents} />
      <Route path={"/admin/inventory"} component={AdminInventory} />
      <Route path={"/admin/documents"} component={AdminDocuments} />
      <Route path={"/admin/matchmaking"} component={AdminMatchmaking} />
      <Route path={"/admin/partner-companies"} component={AdminPartnerCompanies} />
        <Route path="/admin/gallery" component={AdminGallery} />
        <Route path="/admin/menu" component={AdminMenu} />
        <Route path="/admin/events/:id" component={EventDetails} />
      <Route path={'/admin/events/:id/tracking'} component={AdminEventTracking} />
      <Route path={'/admin/staff-map'} component={AdminStaffMap} />       <Route path="/gallery" component={Gallery} />
        <Route path="/menu" component={Menu} />
      <Route path={"/services"} component={Services} />
      <Route path={"/services/:slug"} component={ServiceDetail} />
      <Route path={"/client"} component={ClientPortal} />
      <Route path={"/staff"} component={StaffPortal} />
      <Route path={"/staff/availability"} component={StaffAvailability} />
      <Route path={"/staff/wallet"} component={StaffWallet} />
      <Route path={"/client/events/:id"} component={ClientEventDetails} />
      <Route path={"/client/events/:id/status"} component={ClientEventStatus} />
      <Route path={"/client/financial/:id"} component={ClientFinancial} />
      <Route path={"/install"} component={InstallApp} />
      <Route path={"/work-with-us"} component={RecruitmentPortal} />
      <Route path={"/admin/applications"} component={AdminRecruitment} />
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
