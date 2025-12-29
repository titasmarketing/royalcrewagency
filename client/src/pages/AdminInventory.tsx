import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Plus, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminInventory() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formDate, setFormDate] = useState({
    name: "",
    category: "",
    unit: "un",
    currentStock: "",
    minStock: "",
    unitCost: "",
  });

  const { data: inventory, isLoading, refetch } = trpc.inventory.list.useQuery();
  
  const createItem = trpc.inventory.create.useMutation({
    onSuccess: () => {
      toast.success("Item adicionado ao estoque!");
      setIsCreateDialogOpen(false);
      refetch();
      resetForm();
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar item: ${error.message}`);
    },
  });

  const updateStock = trpc.inventory.updateStock.useMutation({
    onSuccess: () => {
      toast.success("Inventory atualizado!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar estoque: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormDate({
      name: "",
      category: "",
      unit: "un",
      currentStock: "",
      minStock: "",
      unitCost: "",
    });
  };

  const handleCreateItem = () => {
    createItem.mutate(formDate);
  };

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) {
      return { label: "Crítico", variant: "destructive" as const, icon: AlertTriangle };
    } else if (current < min * 1.5) {
      return { label: "Baixo", variant: "secondary" as const, icon: TrendingDown };
    }
    return { label: "Normal", variant: "default" as const, icon: Package };
  };

  const lowStockItems = inventory?.filter((item: any) => 
    item.currentStock <= item.minStock
  ) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Inventory</h1>
            <p className="text-muted-foreground">Controle de insumos e materiais para eventos</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Item ao Inventory</DialogTitle>
                <DialogDescription>
                  Cadastre um novo item de estoque para controle de insumos
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name do Item *</Label>
                  <Input
                    id="name"
                    value={formDate.name}
                    onChange={(e) => setFormDate({ ...formDate, name: e.target.value })}
                    placeholder="Ex: Taça de Gin"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formDate.category}
                      onChange={(e) => setFormDate({ ...formDate, category: e.target.value })}
                      placeholder="Ex: Louças"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={formDate.unit} onValueChange={(value) => setFormDate({ ...formDate, unit: value })}>
                      <SelectTrigger id="unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="un">Unit (un)</SelectItem>
                        <SelectItem value="kg">Quilograma (kg)</SelectItem>
                        <SelectItem value="l">Litro (l)</SelectItem>
                        <SelectItem value="m">Metro (m)</SelectItem>
                        <SelectItem value="cx">Caixa (cx)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentStock">Inventory Atual</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      value={formDate.currentStock}
                      onChange={(e) => setFormDate({ ...formDate, currentStock: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minStock">Inventory Minimum</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={formDate.minStock}
                      onChange={(e) => setFormDate({ ...formDate, minStock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitCost">Custo Unitário (£)</Label>
                  <Input
                    id="unitCost"
                    type="number"
                    step="0.01"
                    value={formDate.unitCost}
                    onChange={(e) => setFormDate({ ...formDate, unitCost: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateItem} disabled={!formDate.name}>
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Itens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {inventory?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Baixo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {lowStockItems.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Value Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                £ {inventory?.reduce((acc: number, item: any) => 
                  acc + (item.currentStock * parseFloat(item.unitCost || "0")), 0
                ).toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categorys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {new Set(inventory?.map((i: any) => i.category).filter(Boolean)).size || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <CardTitle className="text-red-900">Alerta de Inventory Baixo</CardTitle>
              </div>
              <CardDescription className="text-red-700">
                {lowStockItems.length} {lowStockItems.length === 1 ? 'item está' : 'itens estão'} com estoque crítico ou abaixo do mínimo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map((item: any) => (
                  <Badge key={item.id} variant="destructive">
                    {item.name}: {item.currentStock} {item.unit}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inventory List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Package className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : inventory && inventory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventory.map((item: any) => {
              const status = getStockStatus(
                item.currentStock,
                item.minStock
              );
              const StatusIcon = status.icon;
              
              return (
                <Card key={item.id} className="border-2 hover:border-accent/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {item.name}
                          <Badge variant={status.variant} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </CardTitle>
                        {item.category && (
                          <CardDescription className="mt-2">{item.category}</CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Inventory Atual:</span>
                        <span className="font-bold text-foreground">
                          {item.currentStock} {item.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Minimum:</span>
                        <span className="text-muted-foreground">{item.minStock} {item.unit}</span>
                      </div>
                      {item.unitCost && (
                        <div className="flex items-center justify-between text-sm pt-2 border-t">
                          <span className="text-muted-foreground">Custo Unitário:</span>
                          <span className="font-medium text-foreground">
                            £ {parseFloat(item.unitCost).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm font-bold pt-2 border-t">
                        <span className="text-foreground">Value Total:</span>
                        <span className="text-accent">
                          £ {(item.currentStock * parseFloat(item.unitCost || "0")).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Ajustar Inventory
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Edit
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
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">None item no estoque ainda</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Item
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
