import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapView } from "@/components/Map";
import { useState, useEffect } from "react";
import { MapPin, Navigation, CheckCircle, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StaffLocation {
  id: number;
  name: string;
  role: string;
  status: "traveling" | "arrived" | "working";
  lat: number;
  lng: number;
  lastUpdate: Date;
}

export default function ClientTracking() {
  const [eventStatus, setEventStatus] = useState<"scheduled" | "traveling" | "in_progress" | "completed">("traveling");
  const [staffLocations, setStaffLocations] = useState<StaffLocation[]>([
    {
      id: 1,
      name: "João Silva",
      role: "Garçom",
      status: "traveling",
      lat: -23.550520,
      lng: -46.633308,
      lastUpdate: new Date(),
    },
    {
      id: 2,
      name: "Maria Santos",
      role: "Bartender",
      status: "arrived",
      lat: -23.551520,
      lng: -46.634308,
      lastUpdate: new Date(),
    },
  ]);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const handleMapReady = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    
    // Adicionar marcadores para cada membro do staff
    const newMarkers = staffLocations.map((staff) => {
      const marker = new google.maps.Marker({
        position: { lat: staff.lat, lng: staff.lng },
        map: mapInstance,
        title: staff.name,
        icon: {
          url: staff.status === "arrived" 
            ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold;">${staff.name}</h3>
            <p style="margin: 0; color: #666;">${staff.role}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px;">
              Status: ${staff.status === "traveling" ? "Em deslocamento" : "No local"}
            </p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstance, marker);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Centralizar mapa na primeira localização
    if (staffLocations.length > 0) {
      mapInstance.setCenter({ lat: staffLocations[0].lat, lng: staffLocations[0].lng });
      mapInstance.setZoom(14);
    }
  };

  const getStatusInfo = (status: typeof eventStatus) => {
    const statusMap = {
      scheduled: {
        label: "Agendado",
        color: "bg-blue-100 text-blue-700 border-blue-300",
        icon: Clock,
      },
      traveling: {
        label: "Equipe em Deslocamento",
        color: "bg-yellow-100 text-yellow-700 border-yellow-300",
        icon: Navigation,
      },
      in_progress: {
        label: "Serviço em Andamento",
        color: "bg-green-100 text-green-700 border-green-300",
        icon: Users,
      },
      completed: {
        label: "Concluído",
        color: "bg-gray-100 text-gray-700 border-gray-300",
        icon: CheckCircle,
      },
    };
    return statusMap[status];
  };

  const getStaffStatusBadge = (status: StaffLocation["status"]) => {
    const statusMap = {
      traveling: { label: "Em deslocamento", variant: "secondary" as const },
      arrived: { label: "No local", variant: "default" as const },
      working: { label: "Trabalhando", variant: "outline" as const },
    };
    return statusMap[status];
  };

  const statusInfo = getStatusInfo(eventStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Tracking em Tempo Real</h1>
          <p className="text-muted-foreground">
            Acompanhe a localização e status da equipe durante o evento
          </p>
        </div>

        {/* Event Status */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Casamento - Maria & João</CardTitle>
                <CardDescription className="mt-1">
                  {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} • 19:00
                </CardDescription>
              </div>
              <Badge className={`${statusInfo.color} px-4 py-2 text-sm font-medium border`}>
                <StatusIcon className="h-4 w-4 mr-2" />
                {statusInfo.label}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              Localização da Equipe
            </CardTitle>
            <CardDescription>
              Visualize em tempo real onde cada membro da equipe está
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden border-2">
              <MapView onMapReady={handleMapReady} />
            </div>
          </CardContent>
        </Card>

        {/* Staff List */}
        <Card>
          <CardHeader>
            <CardTitle>Equipe Escalada ({staffLocations.length} profissionais)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staffLocations.map((staff) => {
                const statusBadge = getStaffStatusBadge(staff.status);
                return (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between p-4 rounded-lg border-2 hover:border-accent/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{staff.name}</h3>
                        <p className="text-sm text-muted-foreground">{staff.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Atualizado {format(staff.lastUpdate, "HH:mm")}
                        </p>
                      </div>
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline do Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Equipe Confirmada</h4>
                  <p className="text-sm text-muted-foreground">
                    Todos os profissionais confirmaram presença
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Hoje às 14:30</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Navigation className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Equipe em Deslocamento</h4>
                  <p className="text-sm text-muted-foreground">
                    2 de 2 profissionais a caminho do local
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Hoje às 17:45</p>
                </div>
              </div>

              <div className="flex items-start gap-4 opacity-50">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Serviço Iniciado</h4>
                  <p className="text-sm text-muted-foreground">Aguardando início</p>
                  <p className="text-xs text-muted-foreground mt-1">Previsto para 19:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
