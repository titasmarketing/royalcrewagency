import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { MessageSquare, Send, Calendar, User, Clock } from "lucide-react";
import { toast } from "sonner";

export default function AdminMessages() {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  // Buscar todos os eventos com mensagens
  const { data: allEvents } = trpc.events.list.useQuery();
  
  // Buscar mensagens do evento selecionado
  const { data: messages, refetch: refetchMessages } = trpc.staff.getEventMessages.useQuery(
    { eventId: selectedEventId! },
    { enabled: !!selectedEventId }
  );

  const sendMessageMutation = trpc.staff.sendMessage.useMutation({
    onSuccess: () => {
      toast.success("Message sent! 💬");
      setReplyText("");
      refetchMessages();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedEventId) return;

    sendMessageMutation.mutate({
      eventId: selectedEventId,
      message: replyText,
    });
  };

  // Filtrar eventos que têm mensagens (simplificado - na prática você criaria uma API específica)
  const eventsWithMessages = allEvents?.filter(event => event.id) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0c1b33] uppercase tracking-wider">
            Staff Messages
          </h1>
          <p className="text-gray-600 mt-2">
            View and respond to messages from staff members
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Events List (Sidebar) */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                Events
              </CardTitle>
              <CardDescription>Select an event to view messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {eventsWithMessages.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No events found</p>
              ) : (
                eventsWithMessages.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedEventId === event.id
                        ? "bg-[#D4AF37]/10 border-[#D4AF37]"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="font-medium text-sm text-[#0c1b33] line-clamp-1">
                      {event.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "TBD"}
                      </span>
                    </div>
                    <Badge
                      className="mt-2 text-[10px]"
                      variant={event.status === "confirmed" ? "default" : "secondary"}
                    >
                      {event.status}
                    </Badge>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
                Conversation
              </CardTitle>
              <CardDescription>
                {selectedEventId
                  ? `Messages for ${eventsWithMessages.find(e => e.id === selectedEventId)?.title || "this event"}`
                  : "Select an event to view messages"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedEventId ? (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-400">Select an event from the list to view messages</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Messages List */}
                  <div className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto space-y-3">
                    {!messages || messages.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-8">
                        No messages yet for this event
                      </p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-lg ${
                            msg.senderRole === "admin"
                              ? "bg-[#D4AF37]/10 ml-8 border-l-4 border-[#D4AF37]"
                              : "bg-white mr-8 border-l-4 border-blue-500"
                          }`}
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">
                                {msg.senderRole === "admin" ? "Admin (You)" : msg.staffName || "Staff"}
                              </span>
                              <Badge
                                variant={msg.senderRole === "admin" ? "default" : "secondary"}
                                className="text-[10px]"
                              >
                                {msg.senderRole}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(msg.createdAt).toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Message */}
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Reply Box */}
                  <div className="space-y-3 pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-700">
                      Send Reply
                    </label>
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your message to staff..."
                      rows={4}
                      className="w-full"
                    />
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || sendMessageMutation.isPending}
                      className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-[#0c1b33]"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
