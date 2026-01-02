import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Image, Plus, Edit, Trash2, Star, Upload } from "lucide-react";
import { toast } from "sonner";

type GalleryPhoto = {
  id: number;
  title: string;
  description?: string | null;
  imageUrl: string;
  imageKey: string;
  category: string;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export default function AdminGallery() {
  const [showDialog, setShowDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  
  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>("");
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    category: "weddings" as const,
    isFeatured: false,
    displayOrder: 0,
  });
  const [uploading, setUploading] = useState(false);

  const { data: photos, refetch } = trpc.gallery.list.useQuery();

  const createMutation = trpc.gallery.create.useMutation({
    onSuccess: () => {
      toast.success("Photo uploaded successfully!");
      refetch();
      setShowUploadDialog(false);
      resetUploadForm();
    },
    onError: (error) => {
      toast.error("Error uploading photo: " + error.message);
      setUploading(false);
    },
  });

  const updateMutation = trpc.gallery.update.useMutation({
    onSuccess: () => {
      toast.success("Photo updated successfully!");
      refetch();
      setShowDialog(false);
      setEditingPhoto(null);
    },
    onError: (error) => {
      toast.error("Error updating photo: " + error.message);
    },
  });

  const deleteMutation = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      toast.success("Photo deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error("Error deleting photo: " + error.message);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select a file");
      return;
    }

    if (!uploadData.title) {
      toast.error("Please enter a title");
      return;
    }

    setUploading(true);

    try {
      // Upload to S3
      const formData = new FormData();
      formData.append("file", uploadFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { url, key } = await response.json();

      // Create gallery entry
      createMutation.mutate({
        ...uploadData,
        imageUrl: url,
        imageKey: key,
      });
    } catch (error: any) {
      toast.error("Error uploading file: " + error.message);
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadPreview("");
    setUploadData({
      title: "",
      description: "",
      category: "weddings",
      isFeatured: false,
      displayOrder: 0,
    });
    setUploading(false);
  };

  const handleEdit = (photo: GalleryPhoto) => {
    setEditingPhoto(photo);
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!editingPhoto) return;

    updateMutation.mutate({
      id: editingPhoto.id,
      title: editingPhoto.title,
      description: editingPhoto.description || undefined,
      category: editingPhoto.category as any,
      isFeatured: editingPhoto.isFeatured,
      displayOrder: editingPhoto.displayOrder,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      deleteMutation.mutate({ id });
    }
  };

  const categories = [
    { value: "weddings", label: "Weddings" },
    { value: "corporate_events", label: "Corporate Events" },
    { value: "private_parties", label: "Private Parties" },
    { value: "conferences", label: "Conferences" },
    { value: "gala_dinners", label: "Gala Dinners" },
    { value: "other", label: "Other" },
  ];

  const getCategoryLabel = (value: string) => {
    return categories.find((c) => c.value === value)?.label || value;
  };

  const filteredPhotos = photos?.filter((photo) => {
    if (filterCategory !== "all" && photo.category !== filterCategory) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                <Image className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#0c1b33]">Gallery</h1>
                <p className="text-sm text-gray-500">Manage event photos and portfolio</p>
              </div>
            </div>
            <Button
              onClick={() => setShowUploadDialog(true)}
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0c1b33]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </div>
        </div>

        {/* Filter */}
        <Card className="p-6 mb-6 border-[#D4AF37]/20">
          <div className="flex items-center gap-4">
            <Label>Filter by Category</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filterCategory !== "all" && (
              <Button variant="outline" onClick={() => setFilterCategory("all")}>
                Clear Filter
              </Button>
            )}
          </div>
        </Card>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {!filteredPhotos || filteredPhotos.length === 0 ? (
            <Card className="col-span-full p-20 text-center border-2 border-dashed border-gray-200">
              <Image className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No photos yet</p>
              <p className="text-gray-400 text-sm">Upload your first event photo</p>
            </Card>
          ) : (
            filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-all group">
                <div className="relative aspect-square">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  {photo.isFeatured && (
                    <div className="absolute top-2 right-2 bg-[#D4AF37] text-[#0c1b33] p-2 rounded-full">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(photo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(photo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#0c1b33] mb-1 truncate">{photo.title}</h3>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(photo.category)}
                    </Badge>
                    <span className="text-xs text-gray-400">#{photo.displayOrder}</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Photo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Photo File</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {uploadPreview ? (
                    <div className="space-y-4">
                      <img
                        src={uploadPreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          setUploadFile(null);
                          setUploadPreview("");
                        }}
                      >
                        Change Photo
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={uploadData.title}
                    onChange={(e) =>
                      setUploadData({ ...uploadData, title: e.target.value })
                    }
                    placeholder="Event photo title"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={uploadData.description}
                    onChange={(e) =>
                      setUploadData({ ...uploadData, description: e.target.value })
                    }
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={uploadData.category}
                    onValueChange={(value: any) =>
                      setUploadData({ ...uploadData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={uploadData.displayOrder}
                    onChange={(e) =>
                      setUploadData({
                        ...uploadData,
                        displayOrder: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={uploadData.isFeatured}
                    onCheckedChange={(checked) =>
                      setUploadData({ ...uploadData, isFeatured: checked as boolean })
                    }
                  />
                  <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                    Featured (Show on homepage)
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0c1b33]"
                disabled={uploading || !uploadFile}
              >
                {uploading ? "Uploading..." : "Upload Photo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Photo</DialogTitle>
            </DialogHeader>
            {editingPhoto && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <img
                    src={editingPhoto.imageUrl}
                    alt={editingPhoto.title}
                    className="w-full rounded-lg max-h-64 object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editingPhoto.title}
                      onChange={(e) =>
                        setEditingPhoto({ ...editingPhoto, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={editingPhoto.description || ""}
                      onChange={(e) =>
                        setEditingPhoto({ ...editingPhoto, description: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={editingPhoto.category}
                      onValueChange={(value) =>
                        setEditingPhoto({ ...editingPhoto, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      value={editingPhoto.displayOrder}
                      onChange={(e) =>
                        setEditingPhoto({
                          ...editingPhoto,
                          displayOrder: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2 flex items-center space-x-2">
                    <Checkbox
                      id="edit-featured"
                      checked={editingPhoto.isFeatured}
                      onCheckedChange={(checked) =>
                        setEditingPhoto({ ...editingPhoto, isFeatured: checked as boolean })
                      }
                    />
                    <label htmlFor="edit-featured" className="text-sm font-medium cursor-pointer">
                      Featured (Show on homepage)
                    </label>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0c1b33]"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
