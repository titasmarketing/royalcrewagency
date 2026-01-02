import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Building2, Plus, Edit, Trash2, Check, X, Phone, Mail, MapPin, Globe } from "lucide-react";
import { toast } from "sonner";

type PartnerCompany = {
  id: number;
  companyName: string;
  businessType: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string | null;
  city?: string | null;
  county?: string | null;
  postcode?: string | null;
  servicesOffered?: string | null;
  description?: string | null;
  website?: string | null;
  status: string;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function AdminPartnerCompanies() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<PartnerCompany | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const { data: companies, refetch } = trpc.partnerCompanies.list.useQuery();

  const updateMutation = trpc.partnerCompanies.update.useMutation({
    onSuccess: () => {
      toast.success("Company updated successfully!");
      refetch();
      setShowDialog(false);
      setEditingCompany(null);
    },
    onError: (error) => {
      toast.error("Error updating company: " + error.message);
    },
  });

  const deleteMutation = trpc.partnerCompanies.delete.useMutation({
    onSuccess: () => {
      toast.success("Company deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error("Error deleting company: " + error.message);
    },
  });

  const handleApprove = (id: number) => {
    updateMutation.mutate({ id, status: "approved" });
  };

  const handleReject = (id: number) => {
    updateMutation.mutate({ id, status: "rejected" });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this company?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleEdit = (company: PartnerCompany) => {
    setEditingCompany(company);
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!editingCompany) return;

    updateMutation.mutate({
      id: editingCompany.id,
      companyName: editingCompany.companyName,
      businessType: editingCompany.businessType as any,
      contactPerson: editingCompany.contactPerson,
      email: editingCompany.email,
      phone: editingCompany.phone,
      address: editingCompany.address || undefined,
      city: editingCompany.city || undefined,
      county: editingCompany.county || undefined,
      postcode: editingCompany.postcode || undefined,
      servicesOffered: editingCompany.servicesOffered || undefined,
      description: editingCompany.description || undefined,
      website: editingCompany.website || undefined,
      status: editingCompany.status as any,
      notes: editingCompany.notes || undefined,
    });
  };

  const businessTypes = [
    { value: "catering", label: "Catering & Food Services" },
    { value: "photography_video", label: "Photography & Videography" },
    { value: "chef_services", label: "Chef Services" },
    { value: "decoration", label: "Decoration & Flowers" },
    { value: "sound_lighting", label: "Sound & Lighting" },
    { value: "transportation", label: "Transportation & Valet" },
    { value: "security", label: "Security Services" },
    { value: "cleaning", label: "Cleaning Services" },
    { value: "other", label: "Other Services" },
  ];

  const getBusinessTypeLabel = (value: string) => {
    return businessTypes.find((t) => t.value === value)?.label || value;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const filteredCompanies = companies?.filter((company) => {
    if (filterStatus !== "all" && company.status !== filterStatus) return false;
    if (filterType !== "all" && company.businessType !== filterType) return false;
    return true;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0c1b33]">Partner Companies</h1>
              <p className="text-sm text-gray-500">Manage partner companies and service providers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6 border-[#D4AF37]/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Filter by Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Filter by Type</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {businessTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setFilterStatus("all");
                setFilterType("all");
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Companies List */}
      <div className="space-y-4">
        {!filteredCompanies || filteredCompanies.length === 0 ? (
          <Card className="p-20 text-center border-2 border-dashed border-gray-200">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No companies found</p>
            <p className="text-gray-400 text-sm">Companies will appear here after registration</p>
          </Card>
        ) : (
          filteredCompanies.map((company) => (
            <Card key={company.id} className="p-6 hover:shadow-lg transition-all border-l-4 border-l-[#D4AF37]">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-[#0c1b33]">{company.companyName}</h3>
                        <Badge className={getStatusColor(company.status)}>
                          {company.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#D4AF37] font-semibold mb-2">
                        {getBusinessTypeLabel(company.businessType)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-[#D4AF37]" />
                      <span>{company.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-[#D4AF37]" />
                      <span>{company.phone}</span>
                    </div>
                    {company.city && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-[#D4AF37]" />
                        <span>{company.city}, {company.county}</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="h-4 w-4 text-[#D4AF37]" />
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Contact:</strong> {company.contactPerson}
                    </p>
                    {company.servicesOffered && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Services:</strong> {company.servicesOffered}
                      </p>
                    )}
                    {company.description && (
                      <p className="text-sm text-gray-600">
                        <strong>Description:</strong> {company.description}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-400">
                    Registered: {new Date(company.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                  {company.status === "pending" && (
                    <>
                      <Button
                        onClick={() => handleApprove(company.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(company.id)}
                        variant="destructive"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => handleEdit(company)}
                    variant="outline"
                    className="border-[#D4AF37]/30 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(company.id)}
                    variant="outline"
                    className="border-red-200 hover:border-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          {editingCompany && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={editingCompany.companyName}
                    onChange={(e) =>
                      setEditingCompany({ ...editingCompany, companyName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Select
                    value={editingCompany.businessType}
                    onValueChange={(value) =>
                      setEditingCompany({ ...editingCompany, businessType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input
                    value={editingCompany.contactPerson}
                    onChange={(e) =>
                      setEditingCompany({ ...editingCompany, contactPerson: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editingCompany.email}
                    onChange={(e) =>
                      setEditingCompany({ ...editingCompany, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editingCompany.phone}
                    onChange={(e) =>
                      setEditingCompany({ ...editingCompany, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={editingCompany.website || ""}
                    onChange={(e) =>
                      setEditingCompany({ ...editingCompany, website: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={editingCompany.city || ""}
                    onChange={(e) =>
                      setEditingCompany({ ...editingCompany, city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>County</Label>
                  <Input
                    value={editingCompany.county || ""}
                    onChange={(e) =>
                      setEditingCompany({ ...editingCompany, county: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Postcode</Label>
                  <Input
                    value={editingCompany.postcode || ""}
                    onChange={(e) =>
                      setEditingCompany({ ...editingCompany, postcode: e.target.value.toUpperCase() })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editingCompany.status}
                    onValueChange={(value) =>
                      setEditingCompany({ ...editingCompany, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={editingCompany.address || ""}
                  onChange={(e) =>
                    setEditingCompany({ ...editingCompany, address: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Services Offered</Label>
                <Textarea
                  value={editingCompany.servicesOffered || ""}
                  onChange={(e) =>
                    setEditingCompany({ ...editingCompany, servicesOffered: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingCompany.description || ""}
                  onChange={(e) =>
                    setEditingCompany({ ...editingCompany, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  value={editingCompany.notes || ""}
                  onChange={(e) =>
                    setEditingCompany({ ...editingCompany, notes: e.target.value })
                  }
                  rows={2}
                  placeholder="Internal notes (not visible to company)"
                />
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
  );
}
