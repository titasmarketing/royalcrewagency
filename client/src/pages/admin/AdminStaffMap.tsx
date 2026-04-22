import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, RefreshCw, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/Map";

export default function AdminStaffMap() {
  const [mapReady, setMapReady] = useState(false);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const { data: staffLocations, isLoading, refetch, dataUpdatedAt } = trpc.staff.getAllLocations.useQuery(undefined, {
    refetchInterval: 30000, // auto-refresh every 30s
  });

  const handleMapReady = (map: google.maps.Map) => {
    setMapReady(true);
    if (!staffLocations || staffLocations.length === 0) return;

    // Clear old markers
    markers.forEach(m => m.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    staffLocations.forEach((staff) => {
      if (!staff.latitude || !staff.longitude) return;
      const lat = parseFloat(String(staff.latitude));
      const lng = parseFloat(String(staff.longitude));
      if (isNaN(lat) || isNaN(lng)) return;

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: staff.name || "Staff",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#D4AF37",
          fillOpacity: 1,
          strokeColor: "#0c1b33",
          strokeWeight: 2,
        },
        label: {
          text: (staff.name || "?").charAt(0).toUpperCase(),
          color: "#0c1b33",
          fontWeight: "bold",
          fontSize: "11px",
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family: sans-serif; min-width: 150px;">
            <strong style="color:#0c1b33;">${staff.name || "Staff"}</strong><br/>
            ${staff.phone ? `📞 ${staff.phone}<br/>` : ""}
            <span style="color:#888; font-size:11px;">Updated: ${new Date(staff.updatedAt).toLocaleTimeString()}</span>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Fit bounds to all markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(m => {
        const pos = m.getPosition();
        if (pos) bounds.extend(pos);
      });
      map.fitBounds(bounds);
      if (newMarkers.length === 1) map.setZoom(14);
    }
  };

  const lastUpdate = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "--";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0c1b33]">Staff Location Map</h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time GPS tracking — auto-refreshes every 30 seconds
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Last update: {lastUpdate}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0c1b33]">{staffLocations?.length ?? 0}</p>
              <p className="text-xs text-gray-500">Staff sharing location</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{staffLocations?.length ?? 0}</p>
              <p className="text-xs text-gray-500">Active GPS signals</p>
            </div>
          </Card>
        </div>

        {/* Map */}
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="h-[500px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-3 animate-pulse text-[#D4AF37]" />
                <p>Loading map...</p>
              </div>
            </div>
          ) : !staffLocations || staffLocations.length === 0 ? (
            <div className="h-[500px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No staff sharing location</p>
                <p className="text-sm mt-1">Staff must enable GPS sharing in their portal</p>
              </div>
            </div>
          ) : (
            <MapView
              className="w-full h-[500px]"
              onMapReady={handleMapReady}
            />
          )}
        </Card>

        {/* Staff List */}
        {staffLocations && staffLocations.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold text-[#0c1b33] mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              Staff with active GPS
            </h3>
            <div className="space-y-2">
              {staffLocations.map((staff) => (
                <div key={staff.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                      {(staff.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#0c1b33]">{staff.name}</p>
                      {staff.phone && <p className="text-xs text-gray-500">{staff.phone}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 inline-block animate-pulse" />
                      Live
                    </Badge>
                    <span className="text-[10px] text-gray-400">
                      {new Date(staff.updatedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
