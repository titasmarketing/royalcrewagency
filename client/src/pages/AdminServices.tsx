import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Eye, EyeOff, Star, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminServices() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formDate, setFormDate] = useState({
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
  });

  const { data: services, isLoading, refetch } = trpc.services.listAll.useQuery();
  const createService = trpc.services.create.useMutation({
    onSuccess: () => {
      toast.success("Serviço criado com sucesso!");
      setIsCreateDialogOpen(false);
      refetch();
      resetForm();
    },
    onError: (error) => {
      toast.error(`Erro ao criar serviço: ${error.message}`);
    },
  });

  const updateService = trpc.services.update.useMutation({
    onSuccess: () => {
      toast.success("Serviço atualizado com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar serviço: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormDate({
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
    });
  };

  const handleCreateService = () => {
    createService.mutate(formDate);
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
    setFormDate({ ...formDate, name, slug: generateSlug(name) });
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
                  The service will be automatically published on the website with URL /services/{formDate.slug || "slug-do-servico"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    value={formDate.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Bar de Gin Premium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    value={formDate.slug}
                    onChange={(e) => setFormDate({ ...formDate, slug: e.target.value })}
                    placeholder="bar-de-gin-premium"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL: /services/{formDate.slug || "slug-do-servico"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Description Curta</Label>
                  <Input
                    id="shortDescription"
                    value={formDate.shortDescription}
                    onChange={(e) => setFormDate({ ...formDate, shortDescription: e.target.value })}
                    placeholder="Resumo para cards e previews"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description Completa</Label>
                  <Textarea
                    id="description"
                    value={formDate.description}
                    onChange={(e) => setFormDate({ ...formDate, description: e.target.value })}
                    placeholder="Description detalhada do serviço"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price (£)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    value={formDate.basePrice}
                    onChange={(e) => setFormDate({ ...formDate, basePrice: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Serviço Active</Label>
                    <p className="text-xs text-muted-foreground">Exibir no site público</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formDate.isActive}
                    onCheckedChange={(checked) => setFormDate({ ...formDate, isActive: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isFeatured">Serviço em Featured</Label>
                    <p className="text-xs text-muted-foreground">Aparece no banner da home</p>
                  </div>
                  <Switch
                    id="isFeatured"
                    checked={formDate.isFeatured}
                    onCheckedChange={(checked) => setFormDate({ ...formDate, isFeatured: checked })}
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">SEO</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seoTitle">Título SEO</Label>
                      <Input
                        id="seoTitle"
                        value={formDate.seoTitle}
                        onChange={(e) => setFormDate({ ...formDate, seoTitle: e.target.value })}
                        placeholder="Título para mecanismos de busca"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seoDescription">Description SEO</Label>
                      <Textarea
                        id="seoDescription"
                        value={formDate.seoDescription}
                        onChange={(e) => setFormDate({ ...formDate, seoDescription: e.target.value })}
                        placeholder="Description para mecanismos de busca"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seoKeywords">Palavras-chave</Label>
                      <Input
                        id="seoKeywords"
                        value={formDate.seoKeywords}
                        onChange={(e) => setFormDate({ ...formDate, seoKeywords: e.target.value })}
                        placeholder="bar, gin, premium, Events"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateService} disabled={!formDate.name || !formDate.slug}>
                  Create Serviço
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

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
                        <>
                          <Eye className="h-4 w-4" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Inactive
                        </>
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
                    <Button size="sm" variant="outline">
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
