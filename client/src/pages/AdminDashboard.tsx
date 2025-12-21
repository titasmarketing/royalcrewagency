import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Calendar, Users, Package, TrendingUp, FileText, DollarSign } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: events, isLoading: eventsLoading } = trpc.events.list.useQuery();
  const { data: staff, isLoading: staffLoading } = trpc.staff.list.useQuery();
  const { data: clients, isLoading: clientsLoading } = trpc.clients.list.useQuery();
  const { data: services, isLoading: servicesLoading } = trpc.services.listAll.useQuery();

  const stats = [
    {
      title: "Total de Eventos",
      value: events?.length || 0,
      icon: Calendar,
      description: "Eventos cadastrados",
      color: "text-accent",
    },
    {
      title: "Staff Ativo",
      value: staff?.filter(s => s.isActive).length || 0,
      icon: Users,
      description: "Membros ativos",
      color: "text-accent",
    },
    {
      title: "Clientes",
      value: clients?.length || 0,
      icon: TrendingUp,
      description: "Clientes cadastrados",
      color: "text-accent",
    },
    {
      title: "Serviços",
      value: services?.filter(s => s.isActive).length || 0,
      icon: Package,
      description: "Serviços disponíveis",
      color: "text-accent",
    },
  ];

  const loading = eventsLoading || staffLoading || clientsLoading || servicesLoading;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">Visão geral da plataforma GOD MODE</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-2 hover:border-accent/50 transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {loading ? "..." : stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/calendar">
            <Card className="border-2 hover:border-accent/50 transition-all cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Calendário Mestre</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os eventos em uma interface de calendário
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/services">
            <Card className="border-2 hover:border-accent/50 transition-all cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Gestão de Serviços</CardTitle>
                <CardDescription>
                  Crie e edite serviços que aparecem automaticamente no site
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/staff">
            <Card className="border-2 hover:border-accent/50 transition-all cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Gestão de Staff</CardTitle>
                <CardDescription>
                  Gerencie equipe, disponibilidade e escalas de eventos
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card className="border-2 hover:border-accent/50 transition-all cursor-pointer">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>
                Gere contratos, ordens de serviço e notas fiscais automaticamente
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-all cursor-pointer">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Financeiro</CardTitle>
              <CardDescription>
                Controle pagamentos de clientes e staff
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-all cursor-pointer">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Estoque</CardTitle>
              <CardDescription>
                Gerencie insumos e kits de materiais por serviço
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Eventos Recentes</CardTitle>
            <CardDescription>Últimos eventos cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : events && events.length > 0 ? (
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.eventDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        event.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status === 'quote' ? 'Orçamento' :
                         event.status === 'confirmed' ? 'Confirmado' :
                         event.status === 'in_progress' ? 'Em Andamento' :
                         event.status === 'completed' ? 'Concluído' :
                         'Cancelado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhum evento cadastrado ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
