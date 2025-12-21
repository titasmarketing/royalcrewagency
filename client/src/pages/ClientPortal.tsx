import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { Crown, Calendar, Users, DollarSign, FileText, MapPin, Clock, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ClientPortal() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: profile } = trpc.clients.myProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: events, isLoading: eventsLoading } = trpc.clients.myEvents.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Crown className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <div className="flex items-center gap-3 cursor-pointer">
                  <img src="/royal-crew-logo.jpeg" alt="Royal Crew Agency" className="h-12 w-12 rounded-lg" />
                  <div>
                    <h1 className="text-xl font-bold text-foreground">Royal Crew Agency</h1>
                    <p className="text-xs text-muted-foreground">GOD MODE Platform</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-16">
          <div className="max-w-md mx-auto text-center">
            <Crown className="h-16 w-16 text-accent mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Portal do Cliente</h1>
            <p className="text-muted-foreground mb-8">
              Faça login para acessar seus eventos, acompanhar equipe em tempo real e gerenciar seus serviços.
            </p>
            <Button asChild size="lg" className="gap-2">
              <a href={getLoginUrl()}>
                <Crown className="h-4 w-4" />
                Fazer Login
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Pendente", variant: "secondary" as const },
      confirmed: { label: "Confirmado", variant: "default" as const },
      in_progress: { label: "Em Andamento", variant: "default" as const },
      completed: { label: "Concluído", variant: "outline" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="/royal-crew-logo.jpeg" alt="Royal Crew Agency" className="h-12 w-12 rounded-lg" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Royal Crew Agency</h1>
                  <p className="text-xs text-muted-foreground">Portal do Cliente</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Avatar>
                <AvatarFallback className="bg-accent/10 text-accent font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seus eventos e gerencie seus serviços em tempo real
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {events?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Em Andamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {events?.filter(e => e.status === 'in_progress').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {events?.filter(e => e.status === 'confirmed').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Concluídos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {events?.filter(e => e.status === 'completed').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Meus Eventos</h2>
            <Button className="gap-2">
              <Calendar className="h-4 w-4" />
              Solicitar Novo Evento
            </Button>
          </div>

          {eventsLoading ? (
            <div className="flex items-center justify-center h-64">
              <Calendar className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {events.map((event) => {
                const statusInfo = getStatusBadge(event.status);
                return (
                  <Card key={event.id} className="border-2 hover:border-accent/50 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{event.title}</CardTitle>
                            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                          </div>
                          {event.description && (
                            <CardDescription className="mb-4">{event.description}</CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Data do Evento</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(event.eventDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </p>
                          </div>
                        </div>

                        {event.location && (
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Local</p>
                              <p className="text-sm text-muted-foreground">{event.location}</p>
                            </div>
                          </div>
                        )}

                        {event.totalPrice && (
                          <div className="flex items-start gap-3">
                            <DollarSign className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Valor Total</p>
                              <p className="text-sm text-muted-foreground">
                                R$ {parseFloat(event.totalPrice).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t">
                        <Button className="gap-2" onClick={() => navigate(`/cliente/eventos/${event.id}`)}>
                          Ver Detalhes
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <Users className="h-4 w-4" />
                          Tracking de Equipe
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Documentos
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
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Você ainda não tem eventos cadastrados</p>
                <Button className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Solicitar Primeiro Evento
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
