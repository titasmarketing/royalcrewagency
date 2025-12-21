import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Clock, CheckCircle, Download, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Transaction {
  id: number;
  eventTitle: string;
  eventDate: Date;
  amount: number;
  status: "pending" | "paid" | "bonus";
  paymentDate?: Date;
  hours: number;
}

export default function StaffWallet() {
  const transactions: Transaction[] = [
    {
      id: 1,
      eventTitle: "Casamento - Maria & João",
      eventDate: new Date(2024, 11, 15),
      amount: 450.00,
      status: "paid",
      paymentDate: new Date(2024, 11, 20),
      hours: 6,
    },
    {
      id: 2,
      eventTitle: "Festa Corporativa - Tech Summit",
      eventDate: new Date(2024, 11, 22),
      amount: 380.00,
      status: "pending",
      hours: 5,
    },
    {
      id: 3,
      eventTitle: "Aniversário - 50 anos",
      eventDate: new Date(2024, 11, 10),
      amount: 320.00,
      status: "paid",
      paymentDate: new Date(2024, 11, 15),
      hours: 4,
    },
    {
      id: 4,
      eventTitle: "Bônus - Excelente Avaliação",
      eventDate: new Date(2024, 11, 10),
      amount: 100.00,
      status: "bonus",
      paymentDate: new Date(2024, 11, 15),
      hours: 0,
    },
  ];

  const totalPending = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPaid = transactions
    .filter((t) => t.status === "paid" || t.status === "bonus")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBonus = transactions
    .filter((t) => t.status === "bonus")
    .reduce((sum, t) => sum + t.amount, 0);

  const getStatusBadge = (status: Transaction["status"]) => {
    const statusMap = {
      pending: { label: "A Receber", variant: "secondary" as const, color: "text-yellow-600" },
      paid: { label: "Pago", variant: "default" as const, color: "text-green-600" },
      bonus: { label: "Bônus", variant: "outline" as const, color: "text-blue-600" },
    };
    return statusMap[status];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Minha Carteira</h1>
          <p className="text-muted-foreground">
            Acompanhe seus ganhos, pagamentos e histórico financeiro
          </p>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-yellow-200 bg-yellow-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                A Receber
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                £ {totalPending.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {transactions.filter((t) => t.status === "pending").length} evento(s) pendente(s)
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Total Recebido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                £ {totalPaid.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {transactions.filter((t) => t.status === "paid" || t.status === "bonus").length} pagamento(s)
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Bônus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                £ {totalBonus.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {transactions.filter((t) => t.status === "bonus").length} bônus recebido(s)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Extrato Financeiro</CardTitle>
                <CardDescription>Histórico completo de pagamentos e eventos</CardDescription>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="pending">A Receber</TabsTrigger>
                <TabsTrigger value="paid">Pagos</TabsTrigger>
                <TabsTrigger value="bonus">Bônus</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3 mt-4">
                {transactions.map((transaction) => {
                  const statusBadge = getStatusBadge(transaction.status);
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-lg border-2 hover:border-accent/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center`}>
                          <DollarSign className={`h-6 w-6 ${statusBadge.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{transaction.eventTitle}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {format(transaction.eventDate, "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                            {transaction.hours > 0 && (
                              <>
                                <span className="text-muted-foreground">•</span>
                                <p className="text-sm text-muted-foreground">
                                  {transaction.hours}h trabalhadas
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-xl font-bold ${statusBadge.color}`}>
                          £ {transaction.amount.toFixed(2)}
                        </div>
                        <Badge variant={statusBadge.variant} className="mt-1">
                          {statusBadge.label}
                        </Badge>
                        {transaction.paymentDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Pago em {format(transaction.paymentDate, "dd/MM/yyyy")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="pending" className="space-y-3 mt-4">
                {transactions
                  .filter((t) => t.status === "pending")
                  .map((transaction) => {
                    const statusBadge = getStatusBadge(transaction.status);
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg border-2 hover:border-accent/50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{transaction.eventTitle}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(transaction.eventDate, "dd/MM/yyyy", { locale: ptBR })} •{" "}
                              {transaction.hours}h
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-yellow-600">
                            £ {transaction.amount.toFixed(2)}
                          </div>
                          <Badge variant={statusBadge.variant} className="mt-1">
                            {statusBadge.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
              </TabsContent>

              <TabsContent value="paid" className="space-y-3 mt-4">
                {transactions
                  .filter((t) => t.status === "paid")
                  .map((transaction) => {
                    const statusBadge = getStatusBadge(transaction.status);
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg border-2 hover:border-accent/50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{transaction.eventTitle}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(transaction.eventDate, "dd/MM/yyyy", { locale: ptBR })} •{" "}
                              {transaction.hours}h
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            £ {transaction.amount.toFixed(2)}
                          </div>
                          <Badge variant={statusBadge.variant} className="mt-1">
                            {statusBadge.label}
                          </Badge>
                          {transaction.paymentDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Pago em {format(transaction.paymentDate, "dd/MM/yyyy")}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </TabsContent>

              <TabsContent value="bonus" className="space-y-3 mt-4">
                {transactions
                  .filter((t) => t.status === "bonus")
                  .map((transaction) => {
                    const statusBadge = getStatusBadge(transaction.status);
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg border-2 hover:border-accent/50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{transaction.eventTitle}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(transaction.eventDate, "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">
                            £ {transaction.amount.toFixed(2)}
                          </div>
                          <Badge variant={statusBadge.variant} className="mt-1">
                            {statusBadge.label}
                          </Badge>
                          {transaction.paymentDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Recebido em {format(transaction.paymentDate, "dd/MM/yyyy")}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
