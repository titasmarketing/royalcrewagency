import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { Users, Building, Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminClients() {
  const { data: clients, isLoading, refetch } = trpc.clients.list.useQuery();
  const [, setLocation] = useLocation();
  const [editingClient, setEditingClient] = useState<number | null>(null);

  const deleteClient = trpc.clients.delete.useMutation({
    onSuccess: () => {
      toast.success("Client deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error deleting client: ${error.message}`);
    },
  });

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    deleteClient.mutate({ id });
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Clients</h1>
            <p className="text-muted-foreground">Visualize e gerencie todos os clientes</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {clients?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Empresas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {clients?.filter(c => c.companyName).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pessoas Físicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {clients?.filter(c => !c.companyName).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">News este Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {clients?.filter(c => {
                  const created = new Date(c.createdAt);
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                }).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Users className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : clients && clients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <Card key={client.id} className="border-2 hover:border-accent/50 transition-all">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-accent/10 text-accent text-lg font-bold">
                        {client.companyName ? getInitials(client.companyName) : "CL"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="truncate">
                        {client.companyName || "Cliente"}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {client.companyName ? (
                          <Badge variant="default">Empresa</Badge>
                        ) : (
                          <Badge variant="secondary">Pessoa Física</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {client.document && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{client.companyName ? 'CNPJ' : 'CPF'}: {client.document}</span>
                    </div>
                  )}
                  {client.city && client.state && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{client.city}, {client.state}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{client.address}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-3 border-t">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setLocation(`/admin/clients/${client.id}/events`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Events
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setEditingClient(client.id)}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(client.id, client.companyName || "Client")}
                      disabled={deleteClient.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
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
              <p className="text-muted-foreground">None cliente cadastrado ainda</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Edit Client Dialog */}
      <Dialog open={editingClient !== null} onOpenChange={() => setEditingClient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-muted-foreground">
            Client editing form coming soon...
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
