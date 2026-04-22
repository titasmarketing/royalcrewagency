import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useMemo, useEffect } from 'react';
import { Calendar, Plus, Search, UserCheck, UserPlus, Trash2, ExternalLink, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type ClientMode = 'existing' | 'new';

const emptyNewClient = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
};

const emptyEventData = {
  eventDate: '',
  eventType: 'Corporate Event',
  serviceHours: 4,
  location: '',
};

export default function AdminCalendar() {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  const { data: events, isLoading, refetch } = trpc.events.list.useQuery();
  const { data: clients } = trpc.clients.list.useQuery();

  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; title: string } | null>(null);
  const [clientMode, setClientMode] = useState<ClientMode>('existing');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clientSearch, setClientSearch] = useState('');
  const [newClient, setNewClient] = useState(emptyNewClient);
  const [eventData, setEventData] = useState(emptyEventData);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (showNewEventDialog) {
      setClientMode('existing');
      setSelectedClientId('');
      setClientSearch('');
      setNewClient(emptyNewClient);
      setEventData(emptyEventData);
    }
  }, [showNewEventDialog]);

  // Filtered clients for search
  const filteredClients = useMemo(() => {
    if (!clients) return [];
    if (!clientSearch.trim()) return clients;
    const q = clientSearch.toLowerCase();
    return clients.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.companyName || '').toLowerCase().includes(q)
    );
  }, [clients, clientSearch]);

  // Selected client details
  const selectedClient = useMemo(() => {
    if (!selectedClientId || !clients) return null;
    return clients.find(c => c.id === parseInt(selectedClientId)) ?? null;
  }, [selectedClientId, clients]);

  const createForExistingClient = trpc.events.createForExistingClient.useMutation({
    onSuccess: (data) => {
      toast.success("Event created successfully!");
      setShowNewEventDialog(false);
      refetch();
      if (data.eventId) navigate(`/admin/events/${data.eventId}`);
    },
    onError: (error) => toast.error(`Error: ${error.message}`),
  });

  const createBookingMutation = trpc.events.createBooking.useMutation({
    onSuccess: (data) => {
      toast.success("Event created successfully!");
      setShowNewEventDialog(false);
      refetch();
      if (data.eventId) navigate(`/admin/events/${data.eventId}`);
    },
    onError: (error) => toast.error(`Error: ${error.message}`),
  });

  const handleCreateEvent = () => {
    if (!eventData.eventDate) {
      toast.error("Event date is required.");
      return;
    }

    if (clientMode === 'existing') {
      if (!selectedClientId) {
        toast.error("Please select a client.");
        return;
      }
      createForExistingClient.mutate({
        clientId: parseInt(selectedClientId),
        eventDate: eventData.eventDate,
        eventType: eventData.eventType,
        serviceHours: eventData.serviceHours,
        location: eventData.location,
        staffNeeds: [],
      });
    } else {
      if (!newClient.name || !newClient.email) {
        toast.error("Name and email are required for new clients.");
        return;
      }
      createBookingMutation.mutate({
        clientType: 'INDIVIDUAL',
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        address: newClient.address,
        city: newClient.city,
        postalCode: newClient.postalCode,
        eventDate: eventData.eventDate,
        eventType: eventData.eventType,
        serviceHours: eventData.serviceHours,
        location: eventData.location || [newClient.address, newClient.city].filter(Boolean).join(', '),
        staffNeeds: [],
      });
    }
  };

  const isPending = createForExistingClient.isPending || createBookingMutation.isPending;

  const deleteEventMutation = trpc.events.delete.useMutation({
    onSuccess: () => {
      toast.success("Event deleted successfully!");
      setDeleteConfirm(null);
      refetch();
    },
    onError: (error) => toast.error(`Error: ${error.message}`),
  });

  // Transform events for FullCalendar
  const calendarEvents = useMemo(() => {
    if (!events) return [];
    return events.map(event => ({
      id: event.id.toString(),
      title: event.title,
      start: event.eventDate,
      end: event.eventDate,
      backgroundColor:
        event.status === 'confirmed' ? '#10b981' :
        event.status === 'in_progress' ? '#3b82f6' :
        event.status === 'completed' ? '#6b7280' :
        event.status === 'cancelled' ? '#ef4444' :
        '#f59e0b',
      borderColor:
        event.status === 'confirmed' ? '#059669' :
        event.status === 'in_progress' ? '#2563eb' :
        event.status === 'completed' ? '#4b5563' :
        event.status === 'cancelled' ? '#dc2626' :
        '#d97706',
      extendedProps: { status: event.status, location: event.location, clientId: event.clientId }
    }));
  }, [events]);

  const [, navigate] = useLocation();

  const handleEventClick = (info: any) => {
    // Show delete confirm with option to navigate
    setDeleteConfirm({ id: parseInt(info.event.id), title: info.event.title });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Master Calendar</h1>
            <p className="text-muted-foreground">View and manage all events</p>
          </div>
          <Dialog open={showNewEventDialog} onOpenChange={setShowNewEventDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Select an existing client or register a new one</DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {/* Client Mode Toggle */}
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setClientMode('existing')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                      clientMode === 'existing'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <UserCheck className="h-4 w-4" />
                    Existing Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientMode('new')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                      clientMode === 'new'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    New Client
                  </button>
                </div>

                {/* Existing Client Section */}
                {clientMode === 'existing' && (
                  <div className="space-y-3">
                    <Label>Search Client</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="Search by name, email or company..."
                        value={clientSearch}
                        onChange={e => setClientSearch(e.target.value)}
                      />
                    </div>
                    <div className="border border-border rounded-lg max-h-48 overflow-y-auto">
                      {filteredClients.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">No clients found</p>
                      ) : (
                        filteredClients.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedClientId(String(c.id))}
                            className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors border-b border-border last:border-0 ${
                              selectedClientId === String(c.id) ? 'bg-primary/10 border-l-2 border-l-primary' : ''
                            }`}
                          >
                            <div>
                              <p className="font-medium text-sm">{c.name || 'Unnamed Client'}</p>
                              <p className="text-xs text-muted-foreground">{c.email || '—'}</p>
                              {c.companyName && <p className="text-xs text-muted-foreground">{c.companyName}</p>}
                            </div>
                            {selectedClientId === String(c.id) && (
                              <Badge variant="default" className="text-xs">Selected</Badge>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                    {selectedClient && (
                      <div className="rounded-lg bg-muted/50 border border-border px-4 py-3 text-sm space-y-1">
                        <p className="font-semibold">{selectedClient.name}</p>
                        {selectedClient.email && <p className="text-muted-foreground">{selectedClient.email}</p>}
                        {selectedClient.phone && <p className="text-muted-foreground">{selectedClient.phone}</p>}
                        {selectedClient.city && <p className="text-muted-foreground">{selectedClient.city}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* New Client Section */}
                {clientMode === 'new' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} placeholder="John Smith" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input type="email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} placeholder="john@example.com" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} placeholder="+44 20 1234 5678" />
                      </div>
                      <div className="space-y-2">
                        <Label>Postcode</Label>
                        <Input value={newClient.postalCode} onChange={e => setNewClient({...newClient, postalCode: e.target.value})} placeholder="SW1A 1AA" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} placeholder="123 High Street" />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input value={newClient.city} onChange={e => setNewClient({...newClient, city: e.target.value})} placeholder="London" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground mb-3">Event Details</p>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Event Date *</Label>
                        <Input type="date" value={eventData.eventDate} onChange={e => setEventData({...eventData, eventDate: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Service Hours</Label>
                        <Input type="number" min="1" value={eventData.serviceHours} onChange={e => setEventData({...eventData, serviceHours: parseInt(e.target.value) || 1})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Event Type</Label>
                      <Select value={eventData.eventType} onValueChange={v => setEventData({...eventData, eventType: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Wedding">Wedding</SelectItem>
                          <SelectItem value="Corporate Event">Corporate Event</SelectItem>
                          <SelectItem value="Private Party">Private Party</SelectItem>
                          <SelectItem value="Conference">Conference</SelectItem>
                          <SelectItem value="Gala Dinner">Gala Dinner</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Venue / Location (Optional)</Label>
                      <Input value={eventData.location} onChange={e => setEventData({...eventData, location: e.target.value})} placeholder="Full venue address" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setShowNewEventDialog(false)}>Cancel</Button>
                  <Button onClick={handleCreateEvent} disabled={isPending}>
                    {isPending ? "Creating..." : "Create Event"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* View Selector */}
        <div className="flex items-center gap-2">
          <Button variant={currentView === 'month' ? 'default' : 'outline'} onClick={() => setCurrentView('month')}>Month</Button>
          <Button variant={currentView === 'week' ? 'default' : 'outline'} onClick={() => setCurrentView('week')}>Week</Button>
          <Button variant={currentView === 'day' ? 'default' : 'outline'} onClick={() => setCurrentView('day')}>Day</Button>
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Events</CardTitle>
                <CardDescription>Click on an event to view details</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-yellow-500" /><span>Quote</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-green-500" /><span>Confirmed</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-blue-500" /><span>In Progress</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-gray-500" /><span>Completed</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-red-500" /><span>Cancelled</span></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Calendar className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : (
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={currentView === 'month' ? 'dayGridMonth' : currentView === 'week' ? 'timeGridWeek' : 'timeGridDay'}
                events={calendarEvents}
                eventClick={handleEventClick}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: '',
                }}
                height="auto"
                eventDisplay="block"
                dayMaxEvents={3}
              />
            )}
          </CardContent>
        </Card>
      </div>
      {/* Delete Event Confirmation Dialog */}
      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Event Options
            </DialogTitle>
            <DialogDescription>
              <strong>{deleteConfirm?.title}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <Button
              className="w-full gap-2 justify-start"
              variant="outline"
              onClick={() => {
                if (deleteConfirm) {
                  navigate(`/admin/events/${deleteConfirm.id}`);
                  setDeleteConfirm(null);
                }
              }}
            >
              <ExternalLink className="h-4 w-4" />
              View Event Details
            </Button>
            <div className="border-t border-border pt-3">
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Deleting this event will also remove all staff assignments.
              </p>
              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={() => deleteConfirm && deleteEventMutation.mutate({ id: deleteConfirm.id })}
                disabled={deleteEventMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
                {deleteEventMutation.isPending ? "Deleting..." : "Delete Event"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
