import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { FileText, Download, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
export default function AdminDocuments() {
  const { data: events } = trpc.events.list.useQuery();

  const downloadPdf = (data: { pdf: string; filename: string }) => {
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${data.pdf}`;
    link.download = data.filename;
    link.click();
  };

  const generateContractMutation = trpc.documents.generateContractFromEvent.useMutation({
    onSuccess: (data) => { downloadPdf(data); toast.success("Contract generated!"); },
    onError: (error: any) => { toast.error(`Error: ${error.message}`); },
  });
  const generateServiceOrderMutation = trpc.documents.generateServiceOrderFromEvent.useMutation({
    onSuccess: (data) => { downloadPdf(data); toast.success("Service order generated!"); },
    onError: (error: any) => { toast.error(`Error: ${error.message}`); },
  });
  const generateInvoiceMutation = trpc.documents.generateInvoiceFromEvent.useMutation({
    onSuccess: (data) => { downloadPdf(data); toast.success("Invoice generated!"); },
    onError: (error: any) => { toast.error(`Error: ${error.message}`); },
  });

  const handleGenerateContract = (event: any) => generateContractMutation.mutate({ eventId: event.id });
  const handleGenerateServiceOrder = (event: any) => generateServiceOrderMutation.mutate({ eventId: event.id });
  const handleGenerateInvoice = (event: any) => generateInvoiceMutation.mutate({ eventId: event.id });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      quote: { label: "Budget", variant: "secondary" as const },
      confirmed: { label: "Confirmed", variant: "default" as const },
      in_progress: { label: "In Progress", variant: "default" as const },
      completed: { label: "Completed", variant: "outline" as const },
      cancelled: { label: "Cancelled", variant: "destructive" as const },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.quote;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Document Management</h1>
          <p className="text-muted-foreground">
            Generate contracts, service orders and invoices automatically from real event data
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {events?.filter((e) => e.status !== "cancelled" && e.status !== "completed").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Awaiting Contract
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {events?.filter((e) => e.status === "quote").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {events?.filter((e) => e.status === "confirmed").length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Events & Documents</h2>

          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {events.map((event) => {
                const statusInfo = getStatusBadge(event.status);
                return (
                  <Card key={event.id} className="border-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                          </div>
                          <CardDescription className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(event.eventDate), "dd/MM/yyyy")}
                            </span>
                            {event.location && <span>📍 {event.location}</span>}
                            {event.totalPrice && (
                              <span className="font-medium text-accent">
                                £ {parseFloat(event.totalPrice).toFixed(2)}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => handleGenerateContract(event)}
                          disabled={generateContractMutation.isPending}
                        >
                          <FileText className="h-4 w-4" />
                          Generate Contract
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => handleGenerateServiceOrder(event)}
                          disabled={generateServiceOrderMutation.isPending}
                        >
                          <FileText className="h-4 w-4" />
                          Service Order
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => handleGenerateInvoice(event)}
                          disabled={generateInvoiceMutation.isPending}
                        >
                          <FileText className="h-4 w-4" />
                          Invoice
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No events registered</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
