import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminRecruitment() {
  const { data: applications, isLoading, refetch } = trpc.recruitment.listPendingApplications.useQuery();

  const approveMutation = trpc.recruitment.approveApplication.useMutation({
    onSuccess: () => {
      toast.success("Candidatura aprovada com sucesso!");
      refetch();
    },
    onError: () => {
      toast.error("Erro ao aprovar candidatura");
    },
  });

  const rejectMutation = trpc.recruitment.rejectApplication.useMutation({
    onSuccess: () => {
      toast.success("Candidatura rejeitada");
      refetch();
    },
    onError: () => {
      toast.error("Erro ao rejeitar candidatura");
    },
  });

  const handleApprove = (staffId: number) => {
    if (confirm("Tem certeza que deseja aprovar esta candidatura?")) {
      approveMutation.mutate({ staffId });
    }
  };

  const handleReject = (staffId: number) => {
    if (confirm("Tem certeza que deseja rejeitar esta candidatura?")) {
      rejectMutation.mutate({ staffId });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Carregando candidaturas...</div>
        </div>
      </DashboardLayout>
    );
  }

  const pendingCount = applications?.filter((a) => a.status === "pending").length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Candidaturas</h1>
          <p className="text-muted-foreground">
            Analise e aprove novos profissionais para a equipe Royal Crew
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-yellow-200 bg-yellow-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Aguardando análise</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Aprovados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {applications?.filter((a) => a.status === "approved").length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Integrados à equipe</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-red-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                Rejeitados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {applications?.filter((a) => a.status === "rejected").length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Não aprovados</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Candidaturas</CardTitle>
            <CardDescription>Lista de todos os candidatos que se inscreveram</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pendentes ({pendingCount})</TabsTrigger>
                <TabsTrigger value="approved">
                  Aprovados ({applications?.filter((a) => a.status === "approved").length || 0})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejeitados ({applications?.filter((a) => a.status === "rejected").length || 0})
                </TabsTrigger>
              </TabsList>

              {/* Pending */}
              <TabsContent value="pending" className="space-y-4 mt-4">
                {applications?.filter((a) => a.status === "pending").length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Nenhuma candidatura pendente no momento
                  </div>
                ) : (
                  applications
                    ?.filter((a) => a.status === "pending")
                    .map((app) => (
                      <Card key={app.id} className="border-2 hover:border-accent/50 transition-all">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-foreground mb-1">{app.name}</h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {app.specialties &&
                                  Array.isArray(app.specialties) &&
                                  app.specialties.map((spec, idx) => (
                                    <Badge key={idx} variant="outline">
                                      {spec}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="h-3 w-3" />
                              Pendente
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{app.email}</span>
                              </div>
                              {app.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{app.phone}</span>
                                </div>
                              )}
                              {app.cpf && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                                  <span>CPF: {app.cpf}</span>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              {app.hourlyRate && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Pretensão:</span>{" "}
                                  <span className="font-semibold">R$ {app.hourlyRate}/hora</span>
                                </div>
                              )}
                              <div className="text-sm">
                                <span className="text-muted-foreground">Cadastro:</span>{" "}
                                <span>
                                  {app.createdAt && format(new Date(app.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {app.experience && (
                            <div className="mb-4 p-3 bg-accent/5 rounded-lg">
                              <h4 className="text-sm font-semibold mb-1">Experiência:</h4>
                              <p className="text-sm text-muted-foreground">{app.experience}</p>
                            </div>
                          )}

                          {app.bio && (
                            <div className="mb-4 p-3 bg-accent/5 rounded-lg">
                              <h4 className="text-sm font-semibold mb-1">Sobre:</h4>
                              <p className="text-sm text-muted-foreground">{app.bio}</p>
                            </div>
                          )}

                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleApprove(app.id)}
                              className="flex-1 gap-2"
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Aprovar
                            </Button>
                            <Button
                              onClick={() => handleReject(app.id)}
                              variant="destructive"
                              className="flex-1 gap-2"
                              disabled={rejectMutation.isPending}
                            >
                              <XCircle className="h-4 w-4" />
                              Rejeitar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </TabsContent>

              {/* Approved */}
              <TabsContent value="approved" className="space-y-4 mt-4">
                {applications?.filter((a) => a.status === "approved").length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Nenhuma candidatura aprovada ainda
                  </div>
                ) : (
                  applications
                    ?.filter((a) => a.status === "approved")
                    .map((app) => (
                      <Card key={app.id} className="border-2 border-green-200 bg-green-50/20">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-foreground mb-1">{app.name}</h3>
                              <p className="text-sm text-muted-foreground">{app.email}</p>
                            </div>
                            <Badge variant="default" className="gap-1 bg-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Aprovado
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </TabsContent>

              {/* Rejected */}
              <TabsContent value="rejected" className="space-y-4 mt-4">
                {applications?.filter((a) => a.status === "rejected").length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Nenhuma candidatura rejeitada
                  </div>
                ) : (
                  applications
                    ?.filter((a) => a.status === "rejected")
                    .map((app) => (
                      <Card key={app.id} className="border-2 border-red-200 bg-red-50/20">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-foreground mb-1">{app.name}</h3>
                              <p className="text-sm text-muted-foreground">{app.email}</p>
                            </div>
                            <Badge variant="destructive" className="gap-1">
                              <XCircle className="h-3 w-3" />
                              Rejeitado
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
