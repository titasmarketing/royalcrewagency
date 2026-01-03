import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Users, CheckCircle, Clock, Package } from "lucide-react";

export default function ClientEventStatus() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const eventId = parseInt(params.id || "0");

  const { data: event, isLoading } = trpc.events.getById.useQuery({ id: eventId });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c1b33] flex items-center justify-center">
        <p className="text-[#D4AF37]">Loading event status...</p>
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

  // TODO: Adicionar contagem de staff quando API estiver disponível
  const confirmedStaff = 0;
  const checkedInStaff = 0;

  return (
    <div className="min-h-screen bg-[#0c1b33] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c1b33] to-[#1a2942] border-b border-[#D4AF37]/20">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/client")}
            className="text-[#D4AF37] hover:text-[#B8941F] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portal
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#D4AF37] uppercase tracking-wider">
                Event Status
              </h1>
              <p className="text-gray-400 mt-2">{event.title}</p>
            </div>
            <Badge
              className={`text-sm ${
                event.status === "confirmed"
                  ? "bg-green-500/20 text-green-400"
                  : event.status === "completed"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {event.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event Info */}
          <Card className="bg-[#1a2942] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="text-white">
                  {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "TBD"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-white">{event.location || "TBD"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Staff Status */}
          <Card className="bg-[#1a2942] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Confirmed Staff</p>
                <p className="text-2xl font-bold text-white">{confirmedStaff}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Checked In</p>
                <p className="text-2xl font-bold text-green-400">{checkedInStaff}</p>
              </div>
            </CardContent>
          </Card>

          {/* Event Progress */}
          <Card className="bg-[#1a2942] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${event.status === "confirmed" ? "bg-green-500" : "bg-gray-500"}`} />
                  <p className="text-white">Event Confirmed</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${checkedInStaff > 0 ? "bg-green-500" : "bg-gray-500"}`} />
                  <p className="text-white">Team Arrived</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${event.status === "in_progress" ? "bg-green-500" : "bg-gray-500"}`} />
                  <p className="text-white">Event In Progress</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${event.status === "completed" ? "bg-green-500" : "bg-gray-500"}`} />
                  <p className="text-white">Event Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>



        {/* Info Message */}
        <Card className="bg-blue-500/10 border-blue-500/30 mt-6">
          <CardContent className="pt-6">
            <p className="text-blue-300 text-center">
              <Clock className="w-4 h-4 inline mr-2" />
              Status updates are refreshed automatically. You'll be notified of any changes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
