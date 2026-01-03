import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/Map";
import { useState, useEffect } from "react";
import { MapPin, ArrowLeft, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface StaffLocation {
  id: number;
  name: string;
  role: string;
  status: "checked_in" | "checked_out" | "pending";
  lat: number | null;
  lng: number | null;
  checkInTime: Date | null;
  checkOutTime: Date | null;
}

export default function AdminEventTracking() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const eventId = parseInt(params.id || "0");

  const { data: event } = trpc.events.getById.useQuery({ id: eventId });
  const { data: assignments, refetch } = trpc.staff.getStaffAssignments.useQuery({ eventId });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Polling automático a cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetch();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  // Converter assignments para StaffLocation
  const staffLocations: StaffLocation[] = assignments?.map((a: any) => ({
    id: a.id,
    name: a.staffName || "Unknown",
    role: a.role || "Staff",
    status: a.checkOutTime ? "checked_out" : a.checkInTime ? "checked_in" : "pending",
    lat: a.checkInLat,
    lng: a.checkInLng,
    checkInTime: a.checkInTime,
    checkOutTime: a.checkOutTime,
  })) || [];

  // Filtrar apenas staff com localização
  const staffWithLocation = staffLocations.filter(s => s.lat && s.lng);

  const handleMapReady = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    updateMarkers(mapInstance, staffWithLocation);
  };

  // Atualizar marcadores quando dados mudarem
  useEffect(() => {
    if (map) {
      updateMarkers(map, staffWithLocation);
    }
  }, [assignments, map]);

  const updateMarkers = (mapInstance: google.maps.Map, locations: StaffLocation[]) => {
    // Limpar marcadores antigos
    markers.forEach(marker => marker.setMap(null));

    // Criar novos marcadores
    const newMarkers = locations.map((staff) => {
      if (!staff.lat || !staff.lng) return null;

      const marker = new google.maps.Marker({
        position: { lat: staff.lat, lng: staff.lng },
        map: mapInstance,
        title: staff.name,
        icon: {
          url: staff.status === "checked_in"
            ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            : staff.status === "checked_out"
            ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold;">${staff.name}</h3>
            <p style="margin: 0; color: #666;">${staff.role}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px;">
              Status: ${staff.status === "checked_in" ? "Checked In" : staff.status === "checked_out" ? "Checked Out" : "Pending"}
            </p>
            ${staff.checkInTime ? `<p style="margin: 2px 0 0 0; font-size: 11px; color: #999;">
              Check-in: ${new Date(staff.checkInTime).toLocaleTimeString()}
            </p>` : ""}
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstance, marker);
      });

      return marker;
    }).filter(Boolean) as google.maps.Marker[];

    setMarkers(newMarkers);

    // Centralizar mapa na primeira localização
    if (locations.length > 0 && locations[0].lat && locations[0].lng) {
      mapInstance.setCenter({ lat: locations[0].lat, lng: locations[0].lng });
      mapInstance.setZoom(14);
    }
  };

  const checkedInCount = staffLocations.filter(s => s.status === "checked_in").length;
  const checkedOutCount = staffLocations.filter(s => s.status === "checked_out").length;
  const pendingCount = staffLocations.filter(s => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(`/admin/events/${eventId}`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Event
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Live Tracking</h1>
                <p className="text-sm text-gray-500">{event?.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                Auto-refresh: {autoRefresh ? "ON" : "OFF"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Checked In</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{checkedInCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Checked Out</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{checkedOutCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{staffLocations.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Staff Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {staffWithLocation.length > 0 ? (
              <div className="h-[500px] rounded-lg overflow-hidden">
                <MapView onMapReady={handleMapReady} />
              </div>
            ) : (
              <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">No staff locations available yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Staff List */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staffLocations.map((staff) => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{staff.name}</p>
                    <p className="text-sm text-gray-500">{staff.role}</p>
                    {staff.checkInTime && (
                      <p className="text-xs text-gray-400 mt-1">
                        Check-in: {new Date(staff.checkInTime).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {staff.lat && staff.lng && (
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        GPS
                      </Badge>
                    )}
                    <Badge
                      className={
                        staff.status === "checked_in"
                          ? "bg-green-100 text-green-700"
                          : staff.status === "checked_out"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {staff.status === "checked_in" ? "Checked In" : staff.status === "checked_out" ? "Checked Out" : "Pending"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
