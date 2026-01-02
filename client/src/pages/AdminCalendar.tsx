import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useMemo } from 'react';
import { Calendar, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminCalendar() {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  const { data: events, isLoading, refetch } = trpc.events.list.useQuery();
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [newEventData, setNewEventData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    eventDate: '',
    eventType: 'Corporate Event',
    serviceHours: 4,
    location: '',
  });

  const createEventMutation = trpc.events.createBooking.useMutation({
    onSuccess: (data) => {
      toast.success("Event created successfully!");
      setShowNewEventDialog(false);
      refetch();
      // Navigate to event details
      if (data.eventId) {
        navigate(`/admin/events/${data.eventId}`);
      }
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleCreateEvent = () => {
    if (!newEventData.name || !newEventData.email || !newEventData.eventDate) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    createEventMutation.mutate({
      clientType: 'INDIVIDUAL',
      name: newEventData.name,
      email: newEventData.email,
      phone: newEventData.phone,
      address: newEventData.address,
      city: newEventData.city,
      postalCode: newEventData.postalCode,
      eventDate: newEventData.eventDate,
      eventType: newEventData.eventType,
      serviceHours: newEventData.serviceHours,
      location: newEventData.location || `${newEventData.address}, ${newEventData.city}`,
      staffNeeds: [],
    });
  };

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
      extendedProps: {
        status: event.status,
        location: event.location,
        clientId: event.clientId,
      }
    }));
  }, [events]);

  const [, navigate] = useLocation();

  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    navigate(`/admin/events/${eventId}`);
  };

  const handleDateClick = (info: any) => {
    console.log('Date clicked:', info.dateStr);
    // TODO: Open create event modal
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
                <DialogDescription>Fill in the details to create a new event manually</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client Name *</Label>
                    <Input value={newEventData.name} onChange={e => setNewEventData({...newEventData, name: e.target.value})} placeholder="John Smith" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input type="email" value={newEventData.email} onChange={e => setNewEventData({...newEventData, email: e.target.value})} placeholder="john@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={newEventData.phone} onChange={e => setNewEventData({...newEventData, phone: e.target.value})} placeholder="+44 20 1234 5678" />
                  </div>
                  <div className="space-y-2">
                    <Label>Event Date *</Label>
                    <Input type="date" value={newEventData.eventDate} onChange={e => setNewEventData({...newEventData, eventDate: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Event Type</Label>
                    <Select value={newEventData.eventType} onValueChange={v => setNewEventData({...newEventData, eventType: v})}>
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
                    <Label>Service Hours</Label>
                    <Input type="number" value={newEventData.serviceHours} onChange={e => setNewEventData({...newEventData, serviceHours: parseInt(e.target.value)})} min="1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={newEventData.address} onChange={e => setNewEventData({...newEventData, address: e.target.value})} placeholder="123 High Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={newEventData.city} onChange={e => setNewEventData({...newEventData, city: e.target.value})} placeholder="London" />
                  </div>
                  <div className="space-y-2">
                    <Label>Postcode</Label>
                    <Input value={newEventData.postalCode} onChange={e => setNewEventData({...newEventData, postalCode: e.target.value})} placeholder="SW1A 1AA" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location (Optional)</Label>
                  <Input value={newEventData.location} onChange={e => setNewEventData({...newEventData, location: e.target.value})} placeholder="Full venue address" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewEventDialog(false)}>Cancel</Button>
                  <Button onClick={handleCreateEvent} disabled={createEventMutation.isPending}>
                    {createEventMutation.isPending ? "Creating..." : "Create Event"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* View Selector */}
        <div className="flex items-center gap-2">
          <Button 
            variant={currentView === 'month' ? 'default' : 'outline'}
            onClick={() => setCurrentView('month')}
          >
            Month
          </Button>
          <Button 
            variant={currentView === 'week' ? 'default' : 'outline'}
            onClick={() => setCurrentView('week')}
          >
            Week
          </Button>
          <Button 
            variant={currentView === 'day' ? 'default' : 'outline'}
            onClick={() => setCurrentView('day')}
          >
            Day
          </Button>
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Events</CardTitle>
                <CardDescription>
                  Click on a date to create an event or on an event to view details
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span>Budget</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span>Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-500" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span>Cancelled</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <Calendar className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : (
              <div className="calendar-container">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView={currentView === 'month' ? 'dayGridMonth' : currentView === 'week' ? 'timeGridWeek' : 'timeGridDay'}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: ''
                  }}
                  events={calendarEvents}
                  eventClick={handleEventClick}
                  dateClick={handleDateClick}
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  weekends={true}
                  height="auto"
                  locale="en-gb"
                  buttonText={{
                    today: 'Today',
                    month: 'Month',
                    week: 'Week',
                    day: 'Day'
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {events?.filter(e => e.status === 'quote').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {events?.filter(e => e.status === 'confirmed').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {events?.filter(e => e.status === 'in_progress').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {events?.filter(e => e.status === 'completed').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {events?.filter(e => e.status === 'cancelled').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        .calendar-container {
          --fc-border-color: hsl(var(--border));
          --fc-button-bg-color: hsl(var(--primary));
          --fc-button-border-color: hsl(var(--primary));
          --fc-button-hover-bg-color: hsl(var(--primary) / 0.9);
          --fc-button-hover-border-color: hsl(var(--primary) / 0.9);
          --fc-button-active-bg-color: hsl(var(--primary) / 0.8);
          --fc-button-active-border-color: hsl(var(--primary) / 0.8);
          --fc-today-bg-color: hsl(var(--accent) / 0.1);
        }
        
        .fc {
          font-family: inherit;
        }
        
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: hsl(var(--border));
        }
        
        .fc-col-header-cell {
          background-color: hsl(var(--muted));
          font-weight: 600;
        }
        
        .fc-daygrid-day-number {
          color: hsl(var(--foreground));
        }
        
        .fc-event {
          cursor: pointer;
          border-radius: 4px;
        }
        
        .fc-button {
          text-transform: capitalize;
          font-weight: 500;
        }
      `}</style>
    </DashboardLayout>
  );
}
