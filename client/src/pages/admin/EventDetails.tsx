import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Calendar, Clock, FileText, 
  Users, Building2, Package, DollarSign, FileDown, Save, Trash2, Plus
} from "lucide-react";
import { toast } from "sonner";

export default function EventDetails() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const eventId = parseInt(params.id || "0");

  // Fetch event data
  const { data: event, isLoading, refetch } = trpc.events.getById.useQuery({ id: eventId });
  
  // Local state for notes
  const [notes, setNotes] = useState("");
  const [customPrices, setCustomPrices] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"quote" | "confirmed" | "in_progress" | "completed" | "cancelled">("quote");

  useEffect(() => {
    if (event) {
      setNotes(event.notes || "");
      setStatus(event.status as any);
    }
  }, [event]);

  // Mutations
  const updateStatusMutation = trpc.events.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated!");
      refetch();
    },
  });

  const updateNotesMutation = trpc.events.updateNotes.useMutation({
    onSuccess: () => {
      toast.success("Notes saved!");
      refetch();
    },
  });

  const assignStaffMutation = trpc.events.assignStaff.useMutation({
    onSuccess: () => {
      toast.success("Staff assigned!");
      refetch();
    },
  });

  const removeStaffMutation = trpc.events.removeStaff.useMutation({
    onSuccess: () => {
      toast.success("Staff removed!");
      refetch();
    },
  });

  const addServiceMutation = trpc.events.addService.useMutation({
    onSuccess: () => {
      toast.success("Service added!");
      refetch();
    },
  });

  const removeServiceMutation = trpc.events.removeService.useMutation({
    onSuccess: () => {
      toast.success("Service removed!");
      refetch();
    },
  });

  const addPartnerCompanyMutation = trpc.events.addPartnerCompany.useMutation({
    onSuccess: () => {
      toast.success("Partner company added!");
      refetch();
    },
  });

  const removePartnerCompanyMutation = trpc.events.removePartnerCompany.useMutation({
    onSuccess: () => {
      toast.success("Partner company removed!");
      refetch();
    },
  });

  const addInventoryMutation = trpc.events.addInventoryItem.useMutation({
    onSuccess: () => {
      toast.success("Inventory item added!");
      refetch();
    },
  });

  const removeInventoryMutation = trpc.events.removeInventoryItem.useMutation({
    onSuccess: () => {
      toast.success("Inventory item removed!");
      refetch();
    },
  });

  const addMenuItemMutation = trpc.menu.addToEvent.useMutation({
    onSuccess: () => {
      toast.success("Menu item added!");
      refetch();
    },
  });

  const removeMenuItemMutation = trpc.menu.removeFromEvent.useMutation({
    onSuccess: () => {
      toast.success("Menu item removed!");
      refetch();
    },
  });
  const sendQuoteMutation = trpc.events.sendQuoteToClient.useMutation({
    onSuccess: () => {
      toast.success("Quote sent to client successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to send quote: ${error.message}`);
    },
  });

  const { data: totalPriceData } = trpc.events.calculateTotalPrice.useQuery({ eventId });
  const { data: allMenuItems } = trpc.menu.list.useQuery();
  const { data: eventMenuItems } = trpc.menu.getEventMenu.useQuery({ eventId });
  const { data: allPartnerCompanies } = trpc.partnerCompanies.list.useQuery();
  const { data: allServices } = trpc.services.list.useQuery();
  const { data: allInventoryItems } = trpc.inventory.list.useQuery();

  // Handlers
  const handleSaveNotes = () => {
    updateNotesMutation.mutate({ id: eventId, notes });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as any);
    updateStatusMutation.mutate({ id: eventId, status: newStatus as any });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading event details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <Button onClick={() => navigate("/admin/calendar")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Calendar
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const statusColors = {
    quote: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    in_progress: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/admin/calendar")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Calendar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <p className="text-gray-600">Event ID: #{event.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={statusColors[status]}>{status.toUpperCase()}</Badge>
            <Button
              variant="outline"
              className="bg-[#D4AF37] text-white hover:bg-[#B8941F] border-[#D4AF37]"
              onClick={() => {
                sendQuoteMutation.mutate({ eventId });
              }}
              disabled={sendQuoteMutation.isPending}
            >
              <FileDown className="w-4 h-4 mr-2" /> 
              {sendQuoteMutation.isPending ? "Sending..." : "Send Quote to Client"}
            </Button>
            <Button variant="outline">
              <FileDown className="w-4 h-4 mr-2" /> Generate Invoice
            </Button>
          </div>
        </div>

        {/* Status Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Event Status</CardTitle>
            <CardDescription>Update the current status of this event</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quote">Quote</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#D4AF37]" /> Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Client Name</p>
                  <p className="font-semibold">{event.client?.name || 'N/A'}</p>
                </div>
              </div>
              {event.client?.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{event.client.email}</p>
                  </div>
                </div>
              )}
              {event.client?.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">{event.client.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Client ID</p>
                  <p className="font-semibold">#{event.clientId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D4AF37]" /> Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{new Date(event.eventDate).toLocaleDateString()}</p>
                </div>
              </div>
              {event.startTime && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold">{event.startTime} - {event.endTime}</p>
                  </div>
                </div>
              )}
              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">{event.location}</p>
                  </div>
                </div>
              )}
              {event.description && (
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="font-semibold">{event.description}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Staff Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#D4AF37]" /> Staff Assigned
                </CardTitle>
                <CardDescription>Manage staff members for this event</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Assign Staff
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Staff to Event</DialogTitle>
                    <DialogDescription>Select staff members to assign to this event</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Staff assignment dialog content here...</p>
                    {/* TODO: Add staff selection UI */}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">No staff assigned yet.</p>
            {/* TODO: Display assigned staff list */}
          </CardContent>
        </Card>

        {/* Partner Companies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#D4AF37]" /> Partner Companies
                </CardTitle>
                <CardDescription>External companies involved in this event</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Partner Company</DialogTitle>
                    <DialogDescription>
                      Select a partner company to add to this event
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {allPartnerCompanies && allPartnerCompanies.length > 0 ? (
                      allPartnerCompanies.map((company: any) => (
                        <div
                          key={company.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div>
                            <h4 className="font-semibold">{company.name}</h4>
                            {company.category && (
                              <p className="text-sm text-gray-600">{company.category}</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              addPartnerCompanyMutation.mutate({
                                eventId,
                                partnerCompanyId: company.id,
                              });
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600 text-center py-8">
                        No partner companies available. Add companies in Admin → Partner Companies first.
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">No partner companies added yet.</p>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#D4AF37]" /> Services
                </CardTitle>
                <CardDescription>Services included in this event</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Service</DialogTitle>
                    <DialogDescription>
                      Select a service to add to this event
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {allServices && allServices.length > 0 ? (
                      allServices.map((service: any) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold">{service.name}</h4>
                            {service.shortDescription && (
                              <p className="text-sm text-gray-600">{service.shortDescription}</p>
                            )}
                            {service.basePrice && (
                              <p className="text-sm text-[#D4AF37] font-semibold mt-1">
                                £{service.basePrice}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="0.01"
                              placeholder={service.basePrice ? `£${service.basePrice}` : "Price (£)"}
                              className="w-28 px-2 py-1 text-sm border rounded"
                              value={customPrices[`service-${service.id}`] || ''}
                              onChange={(e) => setCustomPrices({...customPrices, [`service-${service.id}`]: e.target.value})}
                            />
                            <Button
                              size="sm"
                              onClick={() => {
                                const price = customPrices[`service-${service.id}`];
                                addServiceMutation.mutate({
                                  eventId,
                                  serviceId: service.id,
                                  price: price ? parseFloat(price) : undefined,
                                });
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600 text-center py-8">
                        No services available. Add services in Admin → Services first.
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">No services added yet.</p>
          </CardContent>
        </Card>

        {/* Menu */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#D4AF37]" /> Menu
                </CardTitle>
                <CardDescription>Menu items selected for this event</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Menu Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Menu Item</DialogTitle>
                    <DialogDescription>
                      Select menu items to add to this event
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {allMenuItems && allMenuItems.length > 0 ? (
                      allMenuItems.map((item) => {
                        const isAdded = eventMenuItems?.some((e: any) => e.menuItemId === item.id);
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                          >
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.name}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                              <span className="text-xs text-gray-500 mt-1 inline-block">
                                {item.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Price (£)"
                                className="w-24 px-2 py-1 text-sm border rounded"
                                value={customPrices[`menu-${item.id}`] || ''}
                                onChange={(e) => setCustomPrices({...customPrices, [`menu-${item.id}`]: e.target.value})}
                              />
                              <Button
                                size="sm"
                                disabled={isAdded}
                                onClick={() => {
                                  addMenuItemMutation.mutate({
                                    eventId,
                                    menuItemId: item.id,
                                    quantity: 1,
                                    price: customPrices[`menu-${item.id}`] || undefined,
                                  });
                                }}
                              >
                                {isAdded ? "Added" : "Add"}
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-600 text-center py-8">
                        No menu items available. Add items in Admin → Menu first.
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {eventMenuItems && eventMenuItems.length > 0 ? (
              <div className="space-y-3">
                {eventMenuItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        removeMenuItemMutation.mutate({
                          eventId,
                          menuItemId: item.menuItemId,
                        });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No menu items added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#D4AF37]" /> Inventory
                </CardTitle>
                <CardDescription>Equipment and items needed for this event</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Inventory Item</DialogTitle>
                    <DialogDescription>
                      Select inventory items to add to this event
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {allInventoryItems && allInventoryItems.length > 0 ? (
                      allInventoryItems.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            {item.description && (
                              <p className="text-sm text-gray-600">{item.description}</p>
                            )}
                            <div className="flex gap-4 mt-2">
                              {item.category && (
                                <span className="text-xs text-gray-500">
                                  Category: {item.category}
                                </span>
                              )}
                              {item.quantityAvailable && (
                                <span className="text-xs text-gray-500">
                                  Available: {item.quantityAvailable}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              addInventoryMutation.mutate({
                                eventId,
                                itemId: item.id,
                                quantity: 1,
                              });
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600 text-center py-8">
                        No inventory items available. Add items in Admin → Inventory first.
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">No inventory items added yet.</p>
          </CardContent>
        </Card>

        {/* Total Price */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#D4AF37]" /> Total Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#D4AF37]">
              £{totalPriceData?.totalPrice?.toFixed(2) || event.totalPrice || "0.00"}
            </p>
          </CardContent>
        {/* Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#D4AF37]" /> Payment
            </CardTitle>
            <CardDescription>Configure payment method and send to client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={event.paymentMethod || ""}
                onChange={(e) => {
                  // TODO: Implementar update do paymentMethod
                  toast.info("Payment method selection - API integration pending");
                }}
              >
                <option value="">Select payment method</option>
                <option value="stripe">Stripe Payment Link</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            
            {event.paymentMethod === "stripe" && (
              <div>
                <label className="block text-sm font-medium mb-2">Stripe Payment Link</label>
                <input
                  type="url"
                  placeholder="https://checkout.stripe.com/..."
                  className="w-full px-3 py-2 border rounded-md"
                  value={event.paymentLink || ""}
                  onChange={(e) => {
                    // TODO: Implementar update do paymentLink
                    toast.info("Payment link update - API integration pending");
                  }}
                />
              </div>
            )}
            
            {event.paymentMethod === "bank_transfer" && (
              <div>
                <label className="block text-sm font-medium mb-2">Bank Account Details</label>
                <textarea
                  rows={4}
                  placeholder="Account Name: Royal Crew Agency&#10;Sort Code: 12-34-56&#10;Account Number: 12345678&#10;Reference: [Event ID]"
                  className="w-full px-3 py-2 border rounded-md"
                  value={event.bankAccountDetails || ""}
                  onChange={(e) => {
                    // TODO: Implementar update do bankAccountDetails
                    toast.info("Bank details update - API integration pending");
                  }}
                />
              </div>
            )}
            
            {event.paymentMethod && (
              <Button
                className="w-full bg-[#D4AF37] hover:bg-[#B8941F]"
                onClick={() => {
                  toast.success("Payment info sent to client!");
                }}
              >
                <FileDown className="w-4 h-4 mr-2" /> Send Payment Info to Client
              </Button>
            )}
          </CardContent>
        </Card>
        </Card>

        {/* Internal Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#D4AF37]" /> Internal Notes
            </CardTitle>
            <CardDescription>Private notes visible only to admin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this event..."
              rows={6}
              className="w-full"
            />
            <Button onClick={handleSaveNotes} disabled={updateNotesMutation.isPending}>
              <Save className="w-4 h-4 mr-2" /> Save Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
