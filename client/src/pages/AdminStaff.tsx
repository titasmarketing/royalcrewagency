import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Users, Star, MapPin, DollarSign, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminStaff() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: staff, isLoading, refetch } = trpc.staff.list.useQuery();
  
  const updateStaff = trpc.staff.update.useMutation({
    onSuccess: () => {
      toast.success("Staff atualizado com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar staff: ${error.message}`);
    },
  });

  const handleToggleActive = (id: number, isActive: boolean) => {
    updateStaff.mutate({ id, isActive });
  };

  const getInitials = (name: string | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Staff</h1>
            <p className="text-muted-foreground">Gerencie equipe, disponibilidade e escalas</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Membro</DialogTitle>
                <DialogDescription>
                  Adicione um novo membro à equipe da Royal Crew
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Funcionalidade em desenvolvimento. Por enquanto, os membros são criados automaticamente quando um usuário com role "staff" faz login.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {staff?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {staff?.filter(s => s.isActive).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {staff?.filter(s => !s.isActive).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avaliação Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {staff && staff.length > 0
                  ? (staff.reduce((acc, s) => acc + parseFloat(s.rating || "0"), 0) / staff.length).toFixed(1)
                  : "0.0"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Users className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : staff && staff.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member) => (
              <Card key={member.id} className="border-2 hover:border-accent/50 transition-all">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.profileImage || undefined} />
                      <AvatarFallback className="bg-accent/10 text-accent text-lg font-bold">
                        {getInitials(member.user?.name || null)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="truncate">{member.user?.name || "Sem nome"}</CardTitle>
                      <CardDescription className="truncate">
                        {member.user?.email || "Sem email"}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        {member.isActive ? (
                          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Inativo
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span>Avaliação: {parseFloat(member.rating || "0").toFixed(1)}/5.0</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Eventos: {member.totalEvents}</span>
                    </div>
                    {member.hourlyRate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>£ {parseFloat(member.hourlyRate).toFixed(2)}/hora</span>
                      </div>
                    )}
                    {member.city && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{member.city}, {member.state}</span>
                      </div>
                    )}
                  </div>

                  {member.specialties && member.specialties.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Especialidades:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      variant={member.isActive ? "outline" : "default"}
                      className="flex-1"
                      onClick={() => handleToggleActive(member.id, !member.isActive)}
                    >
                      {member.isActive ? "Desativar" : "Ativar"}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Nenhum membro de staff cadastrado ainda</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Primeiro Membro
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
