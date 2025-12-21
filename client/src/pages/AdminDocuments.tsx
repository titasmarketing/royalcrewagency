import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { FileText, Download, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminDocuments() {
  const { data: events } = trpc.events.list.useQuery();

  const generateContractMutation = trpc.documents.generateContract.useMutation({
    onSuccess: (data) => {
      // Download PDF
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${data.pdf}`;
      link.download = data.filename;
      link.click();
      toast.success("Contrato gerado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao gerar contrato: ${error.message}`);
    },
  });

  const generateServiceOrderMutation = trpc.documents.generateServiceOrder.useMutation({
    onSuccess: (data) => {
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${data.pdf}`;
      link.download = data.filename;
      link.click();
      toast.success("Ordem de serviço gerada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao gerar ordem de serviço: ${error.message}`);
    },
  });

  const generateInvoiceMutation = trpc.documents.generateInvoice.useMutation({
    onSuccess: (data) => {
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${data.pdf}`;
      link.download = data.filename;
      link.click();
      toast.success("Nota fiscal gerada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao gerar nota fiscal: ${error.message}`);
    },
  });

  const handleGenerateContract = (event: any) => {
    generateContractMutation.mutate({
      eventTitle: event.title,
      eventDate: format(new Date(event.eventDate), "dd/MM/yyyy"),
      clientName: "Cliente Exemplo",
      clientDocument: "000.000.000-00",
      location: event.location || "Local não especificado",
      totalPrice: event.totalPrice || "0.00",
      services: ["Organização de evento", "Equipe completa", "Materiais e insumos"],
    });
  };

  const handleGenerateServiceOrder = (event: any) => {
    generateServiceOrderMutation.mutate({
      eventTitle: event.title,
      eventDate: format(new Date(event.eventDate), "dd/MM/yyyy"),
      location: event.location || "Local não especificado",
      staffMembers: [
        { name: "Exemplo Staff 1", role: "Garçom", startTime: "18:00", endTime: "23:00" },
        { name: "Exemplo Staff 2", role: "Bartender", startTime: "18:00", endTime: "23:00" },
      ],
      inventoryItems: [
        { name: "Taças", quantity: 50, unit: "un" },
        { name: "Guardanapos", quantity: 100, unit: "un" },
      ],
    });
  };

  const handleGenerateInvoice = (event: any) => {
    const subtotal = parseFloat(event.totalPrice || "0");
    const taxes = subtotal * 0.15; // 15% de impostos
    const total = subtotal + taxes;

    generateInvoiceMutation.mutate({
      invoiceNumber: `NF-${Date.now()}`,
      eventTitle: event.title,
      clientName: "Cliente Exemplo",
      clientDocument: "000.000.000-00",
      services: [
        {
          description: "Organização e execução de evento",
          quantity: 1,
          unitPrice: event.totalPrice || "0.00",
          total: event.totalPrice || "0.00",
        },
      ],
      subtotal: subtotal.toFixed(2),
      taxes: taxes.toFixed(2),
      total: total.toFixed(2),
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      quote: { label: "Orçamento", variant: "secondary" as const },
      confirmed: { label: "Confirmado", variant: "default" as const },
      in_progress: { label: "Em Andamento", variant: "default" as const },
      completed: { label: "Concluído", variant: "outline" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.quote;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Documentos</h1>
          <p className="text-muted-foreground">
            Gere contratos, ordens de serviço e notas fiscais automaticamente
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Eventos Ativos
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
                Aguardando Contrato
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
                Confirmados
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
          <h2 className="text-xl font-bold text-foreground">Eventos e Documentos</h2>

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
                              {format(new Date(event.eventDate), "dd/MM/yyyy", { locale: ptBR })}
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
                          Gerar Contrato
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => handleGenerateServiceOrder(event)}
                          disabled={generateServiceOrderMutation.isPending}
                        >
                          <FileText className="h-4 w-4" />
                          Ordem de Serviço
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => handleGenerateInvoice(event)}
                          disabled={generateInvoiceMutation.isPending}
                        >
                          <FileText className="h-4 w-4" />
                          Nota Fiscal
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
                <p className="text-muted-foreground">Nenhum evento cadastrado</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
