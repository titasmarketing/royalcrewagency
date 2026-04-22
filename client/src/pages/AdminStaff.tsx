import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Users, Star, MapPin, DollarSign, Calendar, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type StaffMember = {
  id: number;
  hourlyRate: string | null;
  isActive: boolean | null;
  city: string | null;
  county: string | null;
  rating: string | null;
  totalEvents: number | null;
  profileImage: string | null;
  specialties: string[] | null;
  bio: string | null;
  address: string | null;
  user?: { name: string | null; email: string | null } | null;
};

export default function AdminStaff() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [editForm, setEditForm] = useState({
    hourlyRate: "",
    city: "",
    county: "",
    address: "",
    bio: "",
    isActive: true,
  });

  const { data: staff, isLoading, refetch } = trpc.staffAdmin.list.useQuery();

  const updateStaff = trpc.staffAdmin.update.useMutation({
    onSuccess: () => {
      toast.success("Staff updated successfully!");
      setIsEditDialogOpen(false);
      setEditingMember(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Error updating staff: ${error.message}`);
    },
  });

  const deleteStaff = trpc.staffAdmin.delete.useMutation({
    onSuccess: () => {
      toast.success("Staff member deleted successfully!");
      setIsEditDialogOpen(false);
      setEditingMember(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Error deleting staff: ${error.message}`);
    },
  });

  const handleToggleActive = (id: number, isActive: boolean) => {
    updateStaff.mutate({ id, isActive });
  };

  const openEditDialog = (member: StaffMember) => {
    setEditingMember(member);
    setEditForm({
      hourlyRate: member.hourlyRate || "",
      city: member.city || "",
      county: member.county || "",
      address: member.address || "",
      bio: member.bio || "",
      isActive: member.isActive ?? true,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingMember) return;
    updateStaff.mutate({ id: editingMember.id, ...editForm });
  };

  const handleDelete = () => {
    if (!editingMember) return;
    if (!confirm("Are you sure you want to delete this staff member? This action cannot be undone.")) return;
    deleteStaff.mutate({ id: editingMember.id });
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {staff?.filter(s => s.isActive).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inactives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {staff?.filter(s => !s.isActive).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avaliação Medium</CardTitle>
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) setEditingMember(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
              <DialogDescription>
                {editingMember?.user?.name || "Staff member"} — {editingMember?.user?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hourly Rate (£)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.hourlyRate}
                    onChange={(e) => setEditForm({ ...editForm, hourlyRate: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    placeholder="London"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>County</Label>
                  <Input
                    value={editForm.county}
                    onChange={(e) => setEditForm({ ...editForm, county: e.target.value })}
                    placeholder="Greater London"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="123 Main St"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Input
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Brief description..."
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={editForm.isActive}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
                />
              </div>
            </div>
            <DialogFooter className="flex items-center justify-between w-full">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteStaff.isPending}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {deleteStaff.isPending ? "Deleting..." : "Delete"}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveEdit} disabled={updateStaff.isPending}>
                  {updateStaff.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Inactive
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
                      <span>Events: {member.totalEvents}</span>
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
                        <span>{member.city}, {member.county}</span>
                      </div>
                    )}
                  </div>

                  {member.specialties && member.specialties.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Specialties:</p>
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => openEditDialog(member as StaffMember)}
                    >
                      <Edit className="h-3 w-3" />
                      Edit
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
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
