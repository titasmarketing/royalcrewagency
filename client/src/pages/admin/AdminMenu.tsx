import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function AdminMenu() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    category: "Starters" as "Starters" | "Main Course" | "Desserts" | "Beverages" | "Other",
    name: "",
    description: "",
    ingredients: "",
    imageUrl: "",
    displayOrder: 0,
  });
  const [uploading, setUploading] = useState(false);

  const { data: menuItems, isLoading, refetch } = trpc.menu.listAll.useQuery();
  const createMutation = trpc.menu.create.useMutation({
    onSuccess: () => {
      toast.success("Menu item created successfully!");
      refetch();
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to create menu item: ${error.message}`);
    },
  });

  const updateMutation = trpc.menu.update.useMutation({
    onSuccess: () => {
      toast.success("Menu item updated successfully!");
      refetch();
      setEditingItem(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to update menu item: ${error.message}`);
    },
  });

  const deleteMutation = trpc.menu.delete.useMutation({
    onSuccess: () => {
      toast.success("Menu item deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete menu item: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      category: "Starters",
      name: "",
      description: "",
      ingredients: "",
      imageUrl: "",
      displayOrder: 0,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.url, imageKey: data.key }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error("Please enter a name");
      return;
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      name: item.name,
      description: item.description || "",
      ingredients: item.ingredients || "",
      imageUrl: item.imageUrl || "",
      displayOrder: item.displayOrder || 0,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      deleteMutation.mutate({ id });
    }
  };

  const categories = ["Starters", "Main Course", "Desserts", "Beverages", "Other"];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0c1b33]">Menu Management</h1>
            <p className="text-gray-600 mt-2">Manage your restaurant menu items</p>
          </div>
          <Dialog open={isCreateOpen || !!editingItem} onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingItem(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateOpen(true)} className="bg-[#D4AF37] hover:bg-[#C19B2B] text-[#0c1b33]">
                <Plus className="w-4 h-4 mr-2" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Menu Item" : "Create Menu Item"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Grilled Salmon"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the dish"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Ingredients</Label>
                  <Textarea
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    placeholder="List ingredients separated by commas"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {formData.imageUrl && (
                      <img src={formData.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded" />
                    )}
                  </div>
                </div>

                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setIsCreateOpen(false);
                    setEditingItem(null);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-[#D4AF37] hover:bg-[#C19B2B] text-[#0c1b33]"
                  >
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading menu items...</div>
        ) : !menuItems || menuItems.length === 0 ? (
          <Card className="p-12 text-center">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No menu items yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first menu item</p>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-[#D4AF37] hover:bg-[#C19B2B] text-[#0c1b33]">
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </Card>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => {
              const items = menuItems.filter((item: any) => item.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category}>
                  <h2 className="text-2xl font-bold text-[#0c1b33] mb-4 border-b-2 border-[#D4AF37] pb-2">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item: any) => (
                      <Card key={item.id} className="p-4 hover:shadow-lg transition-shadow">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover rounded mb-4" />
                        )}
                        <h3 className="text-lg font-bold text-[#0c1b33] mb-2">{item.name}</h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        )}
                        {item.ingredients && (
                          <p className="text-gray-500 text-xs mb-4 italic">{item.ingredients}</p>
                        )}
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
