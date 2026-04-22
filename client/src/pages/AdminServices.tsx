import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Eye, EyeOff, Star, Package, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ServiceForm = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  basePrice: string;
  isActive: boolean;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

const emptyForm: ServiceForm = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  basePrice: "",
  isActive: true,
  isFeatured: false,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
};

// ============================================================================
// ServiceFormFields — definido FORA do componente pai para evitar re-mount
// ============================================================================
function ServiceFormFields({
  data,
  onChange,
  onNameChange,
}: {
  data: ServiceForm;
  onChange: (d: ServiceForm) => void;
  onNameChange?: (name: string) => void;
}) {
  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Service Name *</Label>
        <Input
          value={data.name}
          onChange={(e) => {
            const name = e.target.value;
            if (onNameChange) {
              onNameChange(name);
            } else {
              onChange({ ...data, name, slug: generateSlug(name) });
            }
          }}
          placeholder="Ex: Bar de Gin Premium"
        />
      </div>

      <div className="space-y-2">
        <Label>Slug (URL) *</Label>
        <Input
          value={data.slug}
          onChange={(e) => onChange({ ...data, slug: e.target.value })}
          placeholder="bar-de-gin-premium"
        />
        <p className="text-xs text-muted-foreground">URL: /services/{data.slug || "slug-do-servico"}</p>
      </div>

      <div className="space-y-2">
        <Label>Short Description</Label>
        <Input
          value={data.shortDescription}
          onChange={(e) => onChange({ ...data, shortDescription: e.target.value })}
          placeholder="Summary for cards and previews"
        />
      </div>

      <div className="space-y-2">
        <Label>Full Description</Label>
        <Textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Detailed service description"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Base Price (£)</Label>
        <Input
          type="number"
          step="0.01"
          value={data.basePrice}
          onChange={(e) => onChange({ ...data, basePrice: e.target.value })}
          placeholder="0.00"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Active Service</Label>
          <p className="text-xs text-muted-foreground">Show on public website</p>
        </div>
        <Switch
          checked={data.isActive}
          onCheckedChange={(checked) => onChange({ ...data, isActive: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Featured Service</Label>
          <p className="text-xs text-muted-foreground">Appears on home banner</p>
        </div>
        <Switch
          checked={data.isFeatured}
          onCheckedChange={(checked) => onChange({ ...data, isFeatured: checked })}
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-4">SEO</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>SEO Title</Label>
            <Input
              value={data.seoTitle}
              onChange={(e) => onChange({ ...data, seoTitle: e.target.value })}
              placeholder="Title for search engines"
            />
          </div>
          <div className="space-y-2">
            <Label>SEO Description</Label>
            <Textarea
              value={data.seoDescription}
              onChange={(e) => onChange({ ...data, seoDescription: e.target.value })}
              placeholder="Description for search engines"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Keywords</Label>
            <Input
              value={data.seoKeywords}
              onChange={(e) => onChange({ ...data, seoKeywords: e.target.value })}
              placeholder="bar, gin, premium, events"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminServices() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ServiceForm>(emptyForm);
  const [editFormData, setEditFormData] = useState<ServiceForm>(emptyForm);

  const { data: services, isLoading, refetch } = trpc.services.listAll.useQuery();

  const createService = trpc.services.create.useMutation({
    onSuccess: () => {
      toast.success("Service created successfully!");
      setIsCreateDialogOpen(false);
      refetch();
      setFormData(emptyForm);
    },
    onError: (error) => {
      toast.error(`Error creating service: ${error.message}`);
    },
  });

  const updateService = trpc.services.update.useMutation({
    onSuccess: () => {
      toast.success("Service updated successfully!");
      setIsEditDialogOpen(false);
      setEditingServiceId(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Error updating service: ${error.message}`);
    },
  });

  const deleteService = trpc.services.delete.useMutation({
    onSuccess: () => {
      toast.success("Service deleted successfully!");
      setIsEditDialogOpen(false);
      setEditingServiceId(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Error deleting service: ${error.message}`);
    },
  });

  const handleDeleteService = () => {
    if (editingServiceId === null) return;
    if (!confirm("Are you sure you want to delete this service? This action cannot be undone.")) return;
    deleteService.mutate({ id: editingServiceId });
  };

  const handleCreateService = () => {
    createService.mutate(formData);
  };

  const handleEditService = () => {
    if (editingServiceId === null) return;
    updateService.mutate({ id: editingServiceId, ...editFormData });
  };

  const handleToggleActive = (id: number, isActive: boolean) => {
    updateService.mutate({ id, isActive });
  };

  const handleToggleFeatured = (id: number, isFeatured: boolean) => {
    updateService.mutate({ id, isFeatured });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name, slug: generateSlug(name) });
  };

  const openEditDialog = (service: NonNullable<typeof services>[number]) => {
    setEditingServiceId(service.id);
    setEditFormData({
      name: service.name,
      slug: service.slug,
      shortDescription: service.shortDescription || "",
      description: service.description || "",
      basePrice: service.basePrice ? String(service.basePrice) : "",
      isActive: service.isActive ?? true,
      isFeatured: service.isFeatured ?? false,
      seoTitle: service.seoTitle || "",
      seoDescription: service.seoDescription || "",
      seoKeywords: service.seoKeywords || "",
    });
    setIsEditDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Services Management</h1>
            <p className="text-muted-foreground">Dynamic CMS - Services appear automatically on the website</p>
          </div>

          {/* Create Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Service</DialogTitle>
                <DialogDescription>
                  The service will be automatically published on the website with URL /services/{formData.slug || "slug-do-servico"}
                </DialogDescription>
              </DialogHeader>
              <ServiceFormFields data={formData} onChange={setFormData} onNameChange={handleNameChange} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateService} disabled={!formData.name || !formData.slug || createService.isPending}>
                  {createService.isPending ? "Creating..." : "Create Service"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) setEditingServiceId(null); }}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>
                Update the service details below.
              </DialogDescription>
            </DialogHeader>
            <ServiceFormFields data={editFormData} onChange={setEditFormData} />
            <DialogFooter className="flex items-center justify-between w-full">
              <Button
                variant="destructive"
                onClick={handleDeleteService}
                disabled={deleteService.isPending}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {deleteService.isPending ? "Deleting..." : "Delete Service"}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleEditService} disabled={!editFormData.name || !editFormData.slug || updateService.isPending}>
                  {updateService.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Services List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Package className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="border-2 border-border hover:border-[#D4AF37] transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {service.name}
                        {service.isFeatured && (
                          <Star className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]" />
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {service.shortDescription || "No description"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p><strong>URL:</strong> /services/{service.slug}</p>
                    {service.basePrice && (
                      <p><strong>Price base:</strong> £ {parseFloat(service.basePrice).toFixed(2)}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => handleToggleActive(service.id, !service.isActive)}
                    >
                      {service.isActive ? (
                        <><Eye className="h-4 w-4" />Active</>
                      ) : (
                        <><EyeOff className="h-4 w-4" />Inactive</>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => handleToggleFeatured(service.id, !service.isFeatured)}
                    >
                      <Star className={`h-4 w-4 ${service.isFeatured ? 'fill-accent text-accent' : ''}`} />
                      {service.isFeatured ? 'Featured' : 'Normal'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(service)}
                      title="Edit service"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No services registered yet</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Service
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
