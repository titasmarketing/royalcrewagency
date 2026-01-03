import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, Calendar, MapPin, Clock, DollarSign, Users, 
  UtensilsCrossed, Package, Plus, Trash2, CheckCircle 
} from "lucide-react";
import { toast } from "sonner";

export default function ClientEventDetails() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const eventId = parseInt(params.id || "0");

  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);

  // Fetch event data
  const { data: event, isLoading, refetch } = trpc.events.getById.useQuery({ id: eventId });
  
  // Fetch available menu items
  const { data: menuItems } = trpc.menu.list.useQuery();
  
  // Fetch available services
  const { data: services } = trpc.services.list.useQuery();

  // Fetch event menu items
  const { data: eventMenuItems } = trpc.events.getEventMenuItems.useQuery({ eventId });

  // Fetch event services
  const { data: eventServices } = trpc.events.getEventServices.useQuery({ eventId });

  const addMenuItemMutation = trpc.events.clientAddMenuItem.useMutation({
    onSuccess: () => {
      toast.success("Menu item added!");
      refetch();
    },
  });

  const removeMenuItemMutation = trpc.events.clientRemoveMenuItem.useMutation({
    onSuccess: () => {
      toast.success("Menu item removed!");
      refetch();
    },
  });

  const addServiceMutation = trpc.events.clientAddService.useMutation({
    onSuccess: () => {
      toast.success("Service added!");
      refetch();
    },
  });

  const removeServiceMutation = trpc.events.clientRemoveService.useMutation({
    onSuccess: () => {
      toast.success("Service removed!");
      refetch();
    },
  });

  const confirmBookingMutation = trpc.events.confirmBooking.useMutation({
    onSuccess: () => {
      toast.success("Booking confirmed! Admin has been notified.");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to confirm booking");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c1b33] flex items-center justify-center">
        <p className="text-[#D4AF37]">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0c1b33] flex items-center justify-center">
        <p className="text-[#D4AF37]">Event not found</p>
      </div>
    );
  }

  const totalPrice = event.totalPrice || 0;

  return (
    <div className="min-h-screen bg-[#0c1b33] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c1b33] to-[#1a2942] border-b border-[#D4AF37]/20">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/client/portal")}
            className="text-[#D4AF37] hover:text-[#B8941F] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portal
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#D4AF37] uppercase tracking-wider">
                {event.title}
              </h1>

            </div>
            <Badge
              className={`text-sm ${
                event.status === "confirmed"
                  ? "bg-green-500/20 text-green-400"
                  : event.status === "quote"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}
            >
              {event.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info */}
            <Card className="bg-[#1a2942] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-[#D4AF37]">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="text-white">
                      {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "TBD"}
                    </p>
                  </div>
                </div>



                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white">{event.location || "TBD"}</p>

                  </div>
                </div>

                <div className="flex items-center gap-3">

                </div>
              </CardContent>
            </Card>

            {/* Menu Items */}
            <Card className="bg-[#1a2942] border-[#D4AF37]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5" />
                    Menu Items
                  </CardTitle>
                  <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-[#0c1b33]">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Menu Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1a2942] border-[#D4AF37]/20 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-[#D4AF37]">Add Menu Item</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Select items from our menu
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {menuItems?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-[#0c1b33] rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-white">{item.name}</p>
                              <p className="text-sm text-gray-400">{item.description}</p>
                          <p className="text-[#D4AF37] font-medium mt-1">
                            £{typeof item.price === 'string' ? parseFloat(item.price).toFixed(2) : (item.price || 0).toFixed(2)}
                          </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                addMenuItemMutation.mutate({ eventId, menuItemId: item.id, quantity: 1 });
                                setMenuDialogOpen(false);
                              }}
                              className="bg-[#D4AF37] hover:bg-[#B8941F] text-[#0c1b33]"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {!eventMenuItems || eventMenuItems.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No menu items added yet</p>
                ) : (
                  <div className="space-y-3">
                    {eventMenuItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-[#0c1b33] rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-white">{item.menuItemName}</p>
                          <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                          <p className="text-[#D4AF37] font-medium mt-1">
                            £{((typeof item.menuItemPrice === 'string' ? parseFloat(item.menuItemPrice) : (item.menuItemPrice || 0)) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMenuItemMutation.mutate({ eventId, menuItemId: item.menuItemId })}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="bg-[#1a2942] border-[#D4AF37]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Services
                  </CardTitle>
                  <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-[#0c1b33]">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1a2942] border-[#D4AF37]/20 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-[#D4AF37]">Add Service</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Select services for your event
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {services?.map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center justify-between p-3 bg-[#0c1b33] rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-white">{service.name}</p>
                              <p className="text-sm text-gray-400">{service.description}</p>
                          <p className="text-[#D4AF37] font-medium mt-1">
                            £{typeof service.basePrice === 'string' ? parseFloat(service.basePrice).toFixed(2) : (service.basePrice || 0).toFixed(2)}
                          </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                addServiceMutation.mutate({ eventId, serviceId: service.id });
                                setServiceDialogOpen(false);
                              }}
                              className="bg-[#D4AF37] hover:bg-[#B8941F] text-[#0c1b33]"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {!eventServices || eventServices.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No services added yet</p>
                ) : (
                  <div className="space-y-3">
                    {eventServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-3 bg-[#0c1b33] rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-white">{service.serviceName}</p>
                          <p className="text-[#D4AF37] font-medium mt-1">
                            £{typeof service.servicePrice === 'string' ? parseFloat(service.servicePrice).toFixed(2) : (service.servicePrice || 0).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeServiceMutation.mutate({ eventId, serviceId: service.serviceId })}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Total Price */}
            <Card className="bg-gradient-to-br from-[#D4AF37]/20 to-[#B8941F]/10 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Total Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-[#D4AF37]">
                  £{typeof totalPrice === 'string' ? parseFloat(totalPrice).toFixed(2) : totalPrice.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {event.status === "quote" ? "Estimated quote" : "Final price"}
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-[#1a2942] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-[#D4AF37]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.status === "quote" && (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      if (confirm("Confirm this booking? This will finalize your event request.")) {
                        confirmBookingMutation.mutate({ eventId });
                      }
                    }}
                    disabled={confirmBookingMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {confirmBookingMutation.isPending ? "Confirming..." : "Confirm Booking"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                  onClick={() => navigate(`/client/events/${eventId}/status`)}
                >
                  Track Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
