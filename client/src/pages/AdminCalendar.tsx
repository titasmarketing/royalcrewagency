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

export default function AdminCalendar() {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  const { data: events, isLoading } = trpc.events.list.useQuery();

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

  const handleEventClick = (info: any) => {
    console.log('Event clicked:', info.event);
    // TODO: Open event details modal
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Calendário Mestre</h1>
            <p className="text-muted-foreground">Visualização e gestão de todos os eventos</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        </div>

        {/* View Selector */}
        <div className="flex items-center gap-2">
          <Button 
            variant={currentView === 'month' ? 'default' : 'outline'}
            onClick={() => setCurrentView('month')}
          >
            Mês
          </Button>
          <Button 
            variant={currentView === 'week' ? 'default' : 'outline'}
            onClick={() => setCurrentView('week')}
          >
            Semana
          </Button>
          <Button 
            variant={currentView === 'day' ? 'default' : 'outline'}
            onClick={() => setCurrentView('day')}
          >
            Dia
          </Button>
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Eventos</CardTitle>
                <CardDescription>
                  Clique em uma data para criar um evento ou em um evento para ver detalhes
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span>Orçamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span>Confirmado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span>Em Andamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-500" />
                  <span>Concluído</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span>Cancelado</span>
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
                  locale="pt-br"
                  buttonText={{
                    today: 'Hoje',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia'
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Orçamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {events?.filter(e => e.status === 'quote').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {events?.filter(e => e.status === 'confirmed').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Em Andamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {events?.filter(e => e.status === 'in_progress').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Concluídos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {events?.filter(e => e.status === 'completed').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cancelados</CardTitle>
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
