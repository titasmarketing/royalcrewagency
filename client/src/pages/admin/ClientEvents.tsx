import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useRoute, useLocation } from "wouter";
import { Calendar, MapPin, Users, DollarSign, ArrowLeft, Eye } from "lucide-react";

export default function ClientEvents() {
  const [match, params] = useRoute("/admin/clients/:id/events");
  const [, setLocation] = useLocation();
  const clientId = params?.id ? parseInt(params.id) : 0;

  const { data: client } = trpc.clients.getById.useQuery({ id: clientId });
  const { data: events, isLoading } = trpc.events.listByClient.useQuery({ clientId });

  const statusColors = {
    quote: "bg-yellow-500",
    confirmed: "bg-green-500",
    in_progress: "bg-blue-500",
    completed: "bg-gray-500",
    cancelled: "bg-red-500",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation("/admin/clients")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Events - {client?.companyName || "Cliente"}
            </h1>
            <p className="text-muted-foreground">
              Todos os eventos deste cliente
            </p>
          </div>
        </div>

        {/* Events List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        Event #{event.id}
                        <Badge
                          variant="secondary"
                          className={`${
                            statusColors[event.status as keyof typeof statusColors]
                          } text-white`}
                        >
                          {event.status}
                        </Badge>
                      </CardTitle>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setLocation(`/admin/events/${event.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {new Date(event.eventDate).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{(event as any).guestCount || 0} guests</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm col-span-2">
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    {event.totalPrice && (
                      <div className="flex items-center gap-2 text-sm col-span-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">
                          £{typeof (event as any).totalPrice === 'number' ? (event as any).totalPrice.toFixed(2) : (event as any).totalPrice}
                        </span>
                      </div>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 pt-2 border-t">
                      {event.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum evento encontrado para este cliente
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
