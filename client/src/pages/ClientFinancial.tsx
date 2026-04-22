import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, AlertCircle, CheckCircle, Loader2, Clock } from "lucide-react";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { trpc } from "@/lib/trpc";

export default function ClientFinancial() {
  const { data: myEvents, isLoading } = trpc.events.clientListEvents.useQuery();

  const events = myEvents || [];
  const completedEvents = events.filter(e => e.status === 'completed');
  const pendingEvents = events.filter(e => e.status !== 'completed' && e.status !== 'cancelled');

  const totalPaid = completedEvents.reduce((sum, e) => sum + parseFloat(e.totalPrice || '0'), 0);
  const totalPending = pendingEvents.reduce((sum, e) => sum + parseFloat(e.totalPrice || '0'), 0);

  const getStatusBadge = (event: any) => {
    if (event.status === 'completed') return { label: "Paid", variant: "default" as const, color: "text-green-600", icon: CheckCircle };
    if (event.status === 'in_progress') return { label: "In Progress", variant: "secondary" as const, color: "text-blue-600", icon: Clock };
    if (event.status === 'confirmed') return { label: "Confirmed", variant: "secondary" as const, color: "text-yellow-600", icon: Clock };
    if (event.status === 'cancelled') return { label: "Cancelled", variant: "destructive" as const, color: "text-red-600", icon: AlertCircle };
    return { label: "Quote", variant: "outline" as const, color: "text-orange-600", icon: AlertCircle };
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0c1b33] uppercase tracking-wider">Financial</h1>
          <p className="text-gray-600 mt-2">View your invoices and payment history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Paid</p>
                  <p className="text-3xl font-bold text-green-600">£ {totalPaid.toFixed(2)}</p>
                  <p className="text-xs text-green-600 mt-1">{completedEvents.length} events</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">£ {totalPending.toFixed(2)}</p>
                  <p className="text-xs text-orange-600 mt-1">{pendingEvents.length} events</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-200 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Events</p>
                  <p className="text-3xl font-bold text-blue-600">{events.length}</p>
                  <p className="text-xs text-blue-600 mt-1">All time</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#D4AF37]" />
              Invoices
            </CardTitle>
            <CardDescription>All your event invoices and payment status</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
              </TabsList>

              {["all", "pending", "paid"].map((tab) => {
                const filteredEvents = tab === "all" ? events :
                  tab === "paid" ? completedEvents : pendingEvents;

                return (
                  <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
                    {filteredEvents.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No invoices {tab === "all" ? "yet" : `in ${tab}`}</p>
                        <p className="text-sm">Your event invoices will appear here</p>
                      </div>
                    ) : (
                      filteredEvents.map((event) => {
                        const statusBadge = getStatusBadge(event);
                        const StatusIcon = statusBadge.icon;
                        return (
                          <div key={event.id} className="flex items-center justify-between p-4 rounded-lg border-2 hover:border-[#D4AF37]/50 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                                <StatusIcon className={`h-6 w-6 ${statusBadge.color}`} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{event.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {event.eventDate ? format(new Date(event.eventDate), "dd/MM/yyyy", { locale: enGB }) : 'Date TBD'}
                                  {event.location ? ` • ${event.location}` : ''}
                                </p>
                                <p className="text-xs text-muted-foreground capitalize">{event.status}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-xl font-bold ${statusBadge.color}`}>
                                £ {parseFloat(event.totalPrice || '0').toFixed(2)}
                              </div>
                              <Badge variant={statusBadge.variant} className="mt-1">{statusBadge.label}</Badge>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
