import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Users, Building, Eye, Pencil, Trash2, Plus, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { toast } from "sonner";

type Client = {
  id: number;
  companyName: string | null;
  document: string | null;
  address: string | null;
  city: string | null;
  county?: string | null;
  zipCode: string | null;
  notes: string | null;
  createdAt: Date;
  state?: string | null;
  [key: string]: unknown;
};

export default function AdminClients() {
  const { data: clients, isLoading, refetch } = trpc.clients.list.useQuery();
  const [, setLocation] = useLocation();

  // Delete confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
  const { data: clientEvents } = trpc.events.listByClient.useQuery(
    { clientId: deleteConfirm?.id ?? 0 },
    { enabled: !!deleteConfirm }
  );

  // Edit dialog state
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form, setForm] = useState({
    companyName: "",
    document: "",
    address: "",
    city: "",
    county: "",
    zipCode: "",
    notes: "",
  });

  // New client dialog state
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    document: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  });

  useEffect(() => {
    if (editingClient) {
      setForm({
        companyName: editingClient.companyName || "",
        document: editingClient.document || "",
        address: editingClient.address || "",
        city: editingClient.city || "",
        county: (editingClient.county as string) || "",
        zipCode: editingClient.zipCode || "",
        notes: editingClient.notes || "",
      });
    }
  }, [editingClient]);

  const updateClient = trpc.clients.update.useMutation({
    onSuccess: () => {
      toast.success("Client updated successfully!");
      setEditingClient(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Error updating client: ${error.message}`);
    },
  });

  const deleteClient = trpc.clients.delete.useMutation({
    onSuccess: () => {
      toast.success("Client deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error deleting client: ${error.message}`);
    },
  });

  const createClient = trpc.clients.createManual.useMutation({
    onSuccess: () => {
      toast.success("Client created successfully!");
      setIsNewDialogOpen(false);
      setNewForm({
        name: "",
        email: "",
        phone: "",
        companyName: "",
        document: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        notes: "",
      });
      refetch();
    },
    onError: (error) => {
      toast.error(`Error creating client: ${error.message}`);
    },
  });

  const handleSave = () => {
    if (!editingClient) return;
    updateClient.mutate({ id: editingClient.id, ...form });
  };

  const handleDelete = (id: number, name: string) => {
    setDeleteConfirm({ id, name });
    // Close edit dialog if open
    setEditingClient(null);
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    deleteClient.mutate({ id: deleteConfirm.id, deleteEvents: true });
    setDeleteConfirm(null);
  };

  const handleCreateClient = () => {
    if (!newForm.name.trim() || !newForm.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    createClient.mutate(newForm);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
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
          <Button onClick={() => setIsNewDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Client
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{clients?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Empresas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{clients?.filter(c => c.companyName).length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pessoas Físicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{clients?.filter(c => !c.companyName).length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New this Month</CardTitle>
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
                      <CardTitle className="truncate">{client.companyName || "Cliente"}</CardTitle>
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
                      <span>Doc: {client.document}</span>
                    </div>
                  )}
                  {client.city && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{client.city}{(client as any).state ? `, ${(client as any).state}` : ''}</span>
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
                      Events
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setEditingClient(client as unknown as Client)}
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
              <p className="text-muted-foreground mb-4">No clients registered yet</p>
              <Button onClick={() => setIsNewDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Client
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Client Dialog */}
      <Dialog open={editingClient !== null} onOpenChange={(open) => { if (!open) setEditingClient(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <Label>Company Name</Label>
                <Input
                  value={form.companyName}
                  onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                  placeholder="Company or client name"
                />
              </div>
              <div className="space-y-1">
                <Label>Document</Label>
                <Input
                  value={form.document}
                  onChange={e => setForm(f => ({ ...f, document: e.target.value }))}
                  placeholder="Document number"
                />
              </div>
              <div className="space-y-1">
                <Label>Postcode</Label>
                <Input
                  value={form.zipCode}
                  onChange={e => setForm(f => ({ ...f, zipCode: e.target.value }))}
                  placeholder="SW1A 1AA"
                />
              </div>
              <div className="space-y-1">
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  placeholder="London"
                />
              </div>
              <div className="space-y-1">
                <Label>County</Label>
                <Input
                  value={form.county}
                  onChange={e => setForm(f => ({ ...f, county: e.target.value }))}
                  placeholder="Greater London"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Full address"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Internal notes about this client..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                if (editingClient) handleDelete(editingClient.id, editingClient.companyName || "Client");
                setEditingClient(null);
              }}
              disabled={deleteClient.isPending}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
            <Button variant="outline" onClick={() => setEditingClient(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateClient.isPending}>
              {updateClient.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Client Dialog */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register New Client</DialogTitle>
            <DialogDescription>
              Manually add a client to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Contact Name *</Label>
                <Input
                  value={newForm.name}
                  onChange={e => setNewForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-1">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newForm.email}
                  onChange={e => setNewForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="john@company.com"
                />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input
                  value={newForm.phone}
                  onChange={e => setNewForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+44 7700 000000"
                />
              </div>
              <div className="space-y-1">
                <Label>Company Name</Label>
                <Input
                  value={newForm.companyName}
                  onChange={e => setNewForm(f => ({ ...f, companyName: e.target.value }))}
                  placeholder="Royal Events Ltd"
                />
              </div>
              <div className="space-y-1">
                <Label>Document</Label>
                <Input
                  value={newForm.document}
                  onChange={e => setNewForm(f => ({ ...f, document: e.target.value }))}
                  placeholder="Document number"
                />
              </div>
              <div className="space-y-1">
                <Label>Postcode</Label>
                <Input
                  value={newForm.zipCode}
                  onChange={e => setNewForm(f => ({ ...f, zipCode: e.target.value }))}
                  placeholder="SW1A 1AA"
                />
              </div>
              <div className="space-y-1">
                <Label>City</Label>
                <Input
                  value={newForm.city}
                  onChange={e => setNewForm(f => ({ ...f, city: e.target.value }))}
                  placeholder="London"
                />
              </div>
              <div className="space-y-1">
                <Label>County / State</Label>
                <Input
                  value={newForm.state}
                  onChange={e => setNewForm(f => ({ ...f, state: e.target.value }))}
                  placeholder="Greater London"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Address</Label>
                <Input
                  value={newForm.address}
                  onChange={e => setNewForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Full address"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Notes</Label>
                <Textarea
                  value={newForm.notes}
                  onChange={e => setNewForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Internal notes about this client..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateClient} disabled={createClient.isPending}>
              {createClient.isPending ? "Creating..." : "Create Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Client
            </DialogTitle>
            <DialogDescription>
              You are about to permanently delete <strong>{deleteConfirm?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-3">
            {clientEvents && clientEvents.length > 0 ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-2">
                <p className="text-sm font-semibold text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Calendar Warning
                </p>
                <p className="text-sm text-muted-foreground">
                  This client has <strong>{clientEvents.length} event{clientEvents.length > 1 ? 's' : ''}</strong> in the calendar:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 max-h-32 overflow-y-auto">
                  {clientEvents.map(ev => (
                    <li key={ev.id} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
                      {ev.title} — {ev.eventDate ? new Date(ev.eventDate).toLocaleDateString('en-GB') : 'No date'}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-medium text-destructive">
                  All these events will also be permanently deleted.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                This client has no events in the calendar.
              </p>
            )}
            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteClient.isPending}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {deleteClient.isPending ? "Deleting..." : "Delete Client & Events"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
