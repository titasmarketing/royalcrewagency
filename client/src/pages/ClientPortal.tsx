import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LogOut, Crown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function ClientPortal() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [showNewOrder, setShowNewOrder] = useState(false);
  
  const { data: myEvents, isLoading } = trpc.events.list.useQuery();
  
  const [newOrderForm, setNewOrderForm] = useState({
    eventName: "",
    eventType: "Wedding",
    date: "",
    durationHours: 4,
    location: "",
    postcode: "",
    requiredStaff: [] as Array<{ type: string; count: number }>,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0c1b33] flex items-center justify-center text-[#D4AF37]">
        Loading Royal Access...
      </div>
    );
  }

  const handleCreateOrder = () => {
    // TODO: Integrar com backend
    toast.success("Request submitted successfully!");
    setShowNewOrder(false);
  };

  const addStaffRequirement = (type: string) => {
    const current = [...newOrderForm.requiredStaff];
    const existing = current.find((r) => r.type === type);
    if (existing) {
      existing.count++;
    } else {
      current.push({ type, count: 1 });
    }
    setNewOrderForm({ ...newOrderForm, requiredStaff: current });
  };

  const staffTypes = [
    "Bartender",
    "Waiter",
    "Chef",
    "Receptionist",
    "Security",
    "Cleaning",
    "Coordinator",
    "Valet",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Cliente */}
      <nav className="bg-[#0c1b33] border-b border-[#D4AF37]/20 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-4 cursor-pointer">
              <Crown className="text-[#D4AF37] w-6 h-6" />
              <span className="text-white font-bold tracking-[0.2em] text-sm uppercase">
                Royal Client
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-gray-400 text-[10px] uppercase font-bold hidden md:inline">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-light text-[#0c1b33] tracking-wider">
              Hello, {user.name?.split(" ")[0]}
            </h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
              Welcome to your elite portal
            </p>
          </div>
          <Button
            onClick={() => setShowNewOrder(!showNewOrder)}
            className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0c1b33] font-bold uppercase tracking-wider"
          >
            {showNewOrder ? "Cancel Request" : "Request New Staff"}
          </Button>
        </header>

        {showNewOrder && (
          <Card className="mb-12 border-[#D4AF37]/30 shadow-xl bg-white p-8">
            <h3 className="text-xl font-bold mb-6 text-[#0c1b33] uppercase tracking-widest">
              Event Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Event Name</Label>
                <Input
                  value={newOrderForm.eventName}
                  onChange={(e) =>
                    setNewOrderForm({ ...newOrderForm, eventName: e.target.value })
                  }
                  className="border-gray-200 focus:border-[#D4AF37]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Event Type</Label>
                <Select
                  value={newOrderForm.eventType}
                  onValueChange={(value) =>
                    setNewOrderForm({ ...newOrderForm, eventType: value })
                  }
                >
                  <SelectTrigger className="border-gray-200 focus:border-[#D4AF37]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wedding">Wedding</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Private Party">Private Party</SelectItem>
                    <SelectItem value="Gala">Gala</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Date</Label>
                <Input
                  type="date"
                  value={newOrderForm.date}
                  onChange={(e) =>
                    setNewOrderForm({ ...newOrderForm, date: e.target.value })
                  }
                  className="border-gray-200 focus:border-[#D4AF37]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Duration (Hours)</Label>
                <Input
                  type="number"
                  value={newOrderForm.durationHours}
                  onChange={(e) =>
                    setNewOrderForm({
                      ...newOrderForm,
                      durationHours: parseInt(e.target.value),
                    })
                  }
                  className="border-gray-200 focus:border-[#D4AF37]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Location</Label>
                <Input
                  value={newOrderForm.location}
                  onChange={(e) =>
                    setNewOrderForm({ ...newOrderForm, location: e.target.value })
                  }
                  className="border-gray-200 focus:border-[#D4AF37]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Postcode</Label>
                <Input
                  value={newOrderForm.postcode}
                  onChange={(e) =>
                    setNewOrderForm({
                      ...newOrderForm,
                      postcode: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="SW1A 1AA"
                  className="border-gray-200 focus:border-[#D4AF37]"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                  Required Services
                </label>
                <div className="flex flex-wrap gap-2 mb-6">
                  {staffTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => addStaffRequirement(type)}
                      className="px-4 py-2 border border-gray-200 rounded-md text-xs font-bold uppercase tracking-tighter hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                    >
                      + {type}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {newOrderForm.requiredStaff?.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between bg-gray-50 p-4 rounded-md border border-gray-100"
                    >
                      <span className="font-bold text-[#0c1b33] text-sm uppercase">
                        {req.type}
                      </span>
                      <span className="font-bold text-[#D4AF37]">x {req.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleCreateOrder}
                className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0c1b33] font-bold uppercase tracking-wider"
              >
                Submit Royal Request
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-8">
          <h2 className="text-lg font-bold text-[#0c1b33] uppercase tracking-[0.2em] border-l-4 border-[#D4AF37] pl-4">
            My Events
          </h2>

          {isLoading ? (
            <div className="bg-white p-20 text-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
              Loading...
            </div>
          ) : !myEvents || myEvents.length === 0 ? (
            <div className="bg-white p-20 text-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
              You don't have any active requests yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {myEvents.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-lg transition-all border-l-4 border-l-[#D4AF37] p-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-[#0c1b33]">
                          {event.title}
                        </h3>
                        <Badge
                          variant={
                            event.status === "confirmed"
                              ? "default"
                              : event.status === "completed"
                              ? "secondary"
                              : "outline"
                          }
                          className="uppercase text-[10px] font-bold tracking-wider"
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 tracking-wide uppercase font-light">
                        {new Date(event.eventDate).toLocaleDateString()} •{" "}
                        {event.location}
                      </p>
                    </div>
                    <div className="mt-6 md:mt-0 flex gap-3">
                      <Button 
                        onClick={() => navigate(`/client/events/${event.id}`)}
                        className="text-[10px] uppercase font-bold tracking-wider bg-[#D4AF37] hover:bg-[#B8941F] text-[#0c1b33]"
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/client/events/${event.id}/status`)}
                        className="text-[10px] uppercase font-bold tracking-wider border-[#D4AF37]/30 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                      >
                        View Status
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
