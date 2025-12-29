import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, FileText, Download, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Invoice {
  id: number;
  eventTitle: string;
  eventDate: Date;
  amount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: Date;
  paidDate?: Date;
  invoiceNumber: string;
}

export default function ClientFinancial() {
  const invoices: Invoice[] = [
    {
      id: 1,
      eventTitle: "Casamento - Maria & João",
      eventDate: new Date(2024, 11, 15),
      amount: 8500.00,
      status: "paid",
      dueDate: new Date(2024, 11, 10),
      paidDate: new Date(2024, 11, 8),
      invoiceNumber: "NF-2024-001",
    },
    {
      id: 2,
      eventTitle: "Festa Corporativa - Tech Summit",
      eventDate: new Date(2024, 11, 28),
      amount: 12000.00,
      status: "pending",
      dueDate: new Date(2024, 11, 25),
      invoiceNumber: "NF-2024-002",
    },
    {
      id: 3,
      eventTitle: "Aniversário - 50 anos",
      eventDate: new Date(2024, 10, 20),
      amount: 5500.00,
      status: "overdue",
      dueDate: new Date(2024, 10, 15),
      invoiceNumber: "NF-2024-003",
    },
  ];

  const totalPending = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const overdueCount = invoices.filter((i) => i.status === "overdue").length;

  const getStatusBadge = (status: Invoice["status"]) => {
    const statusMap = {
      pending: { label: "Pendente", variant: "secondary" as const, color: "text-yellow-600" },
      paid: { label: "Pago", variant: "default" as const, color: "text-green-600" },
      overdue: { label: "Vencido", variant: "destructive" as const, color: "text-red-600" },
    };
    return statusMap[status];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Área Financeira</h1>
          <p className="text-muted-foreground">
            Gerencie pagamentos, faturas e documentos fiscais
          </p>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-yellow-200 bg-yellow-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-yellow-600" />
                A Pagar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                £ {totalPending.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {invoices.filter((i) => i.status === "pending" || i.status === "overdue").length} fatura(s)
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Total Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                £ {totalPaid.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {invoices.filter((i) => i.status === "paid").length} pagamento(s)
              </p>
            </CardContent>
          </Card>

          <Card className={`border-2 ${overdueCount > 0 ? "border-red-200 bg-red-50/50" : "border-gray-200"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className={`h-4 w-4 ${overdueCount > 0 ? "text-red-600" : "text-gray-600"}`} />
                Vencidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${overdueCount > 0 ? "text-red-600" : "text-gray-600"}`}>
                {overdueCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {overdueCount > 0 ? "Atenção necessária" : "Nenhum vencimento"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Faturas e Notas Fiscais</CardTitle>
                <CardDescription>History completo de pagamentos e documentos</CardDescription>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar Relatório
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="paid">Pagas</TabsTrigger>
                <TabsTrigger value="overdue">Vencidas</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3 mt-4">
                {invoices.map((invoice) => {
                  const statusBadge = getStatusBadge(invoice.status);
                  return (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 rounded-lg border-2 hover:border-accent/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center`}>
                          <FileText className={`h-6 w-6 ${statusBadge.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{invoice.eventTitle}</h3>
                            <Badge variant="outline" className="text-xs">
                              {invoice.invoiceNumber}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-muted-foreground">
                              Evento: {format(invoice.eventDate, "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                            <span className="text-muted-foreground">•</span>
                            <p className="text-sm text-muted-foreground">
                              Vencimento: {format(invoice.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-4">
                        <div>
                          <div className={`text-xl font-bold ${statusBadge.color}`}>
                            £ {invoice.amount.toFixed(2)}
                          </div>
                          <Badge variant={statusBadge.variant} className="mt-1">
                            {statusBadge.label}
                          </Badge>
                          {invoice.paidDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Pago em {format(invoice.paidDate, "dd/MM/yyyy")}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" className="gap-2">
                            <Download className="h-3 w-3" />
                            NF
                          </Button>
                          {invoice.status !== "paid" && (
                            <Button size="sm" className="gap-2">
                              <CreditCard className="h-3 w-3" />
                              Pagar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="pending" className="space-y-3 mt-4">
                {invoices
                  .filter((i) => i.status === "pending")
                  .map((invoice) => {
                    const statusBadge = getStatusBadge(invoice.status);
                    return (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 rounded-lg border-2 hover:border-accent/50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{invoice.eventTitle}</h3>
                            <p className="text-sm text-muted-foreground">
                              Vence em {format(invoice.dueDate, "dd/MM/yyyy")}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-4">
                          <div>
                            <div className="text-xl font-bold text-yellow-600">
                              £ {invoice.amount.toFixed(2)}
                            </div>
                            <Badge variant={statusBadge.variant} className="mt-1">
                              {statusBadge.label}
                            </Badge>
                          </div>
                          <Button size="sm" className="gap-2">
                            <CreditCard className="h-3 w-3" />
                            Pagar Agora
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </TabsContent>

              <TabsContent value="paid" className="space-y-3 mt-4">
                {invoices
                  .filter((i) => i.status === "paid")
                  .map((invoice) => {
                    const statusBadge = getStatusBadge(invoice.status);
                    return (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 rounded-lg border-2 hover:border-accent/50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{invoice.eventTitle}</h3>
                            <p className="text-sm text-muted-foreground">
                              Pago em {invoice.paidDate && format(invoice.paidDate, "dd/MM/yyyy")}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-4">
                          <div>
                            <div className="text-xl font-bold text-green-600">
                              £ {invoice.amount.toFixed(2)}
                            </div>
                            <Badge variant={statusBadge.variant} className="mt-1">
                              {statusBadge.label}
                            </Badge>
                          </div>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Download className="h-3 w-3" />
                            Baixar NF
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </TabsContent>

              <TabsContent value="overdue" className="space-y-3 mt-4">
                {invoices
                  .filter((i) => i.status === "overdue")
                  .map((invoice) => {
                    const statusBadge = getStatusBadge(invoice.status);
                    return (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 rounded-lg border-2 border-red-200 bg-red-50/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{invoice.eventTitle}</h3>
                            <p className="text-sm text-red-600 font-medium">
                              Venceu em {format(invoice.dueDate, "dd/MM/yyyy")}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-4">
                          <div>
                            <div className="text-xl font-bold text-red-600">
                              £ {invoice.amount.toFixed(2)}
                            </div>
                            <Badge variant={statusBadge.variant} className="mt-1">
                              {statusBadge.label}
                            </Badge>
                          </div>
                          <Button size="sm" variant="destructive" className="gap-2">
                            <CreditCard className="h-3 w-3" />
                            Regularizar
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Formas de Pagamento</CardTitle>
            <CardDescription>Escolha como deseja efetuar o pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <CreditCard className="h-6 w-6" />
                <span>Cartão de Crédito</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Boleto Bancário</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <DollarSign className="h-6 w-6" />
                <span>PIX</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
