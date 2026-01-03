import { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  LogOut, Crown, Calendar, MapPin, Clock, CheckCircle, XCircle,
  User, MessageSquare, Home, Camera, Upload, Navigation, Trash2, Send
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
// Upload handled via tRPC API

type Tab = "jobs" | "profile" | "messages";

export default function StaffPortal() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("jobs");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  
  const { data: myJobs, isLoading, refetch } = trpc.staff.myJobs.useQuery();
  const { data: myPhotos, refetch: refetchPhotos } = trpc.staff.getPhotos.useQuery();
  const { data: messages, refetch: refetchMessages } = trpc.staff.getMessages.useQuery(
    { eventId: selectedEventId! },
    { enabled: !!selectedEventId }
  );
  
  const acceptJobMutation = trpc.staff.acceptJob.useMutation();
  const declineJobMutation = trpc.staff.declineJob.useMutation();
  const checkInMutation = trpc.staff.checkIn.useMutation();
  const checkOutMutation = trpc.staff.checkOut.useMutation();
  const uploadPhotoMutation = trpc.staff.uploadPhoto.useMutation();
  const deletePhotoMutation = trpc.staff.deletePhoto.useMutation();
  const sendMessageMutation = trpc.staff.sendMessage.useMutation();

  const handleUploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5MB)");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        await uploadPhotoMutation.mutateAsync({ photoData: base64, fileName: file.name });
        toast.success("Photo uploaded! 📸");
        refetchPhotos();
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload photo");
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    try {
      await deletePhotoMutation.mutateAsync({ photoId });
      toast.success("Photo deleted");
      refetchPhotos();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete photo");
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedEventId) return;

    try {
      await sendMessageMutation.mutateAsync({ eventId: selectedEventId, message: messageText });
      setMessageText("");
      toast.success("Message sent! 💬");
      refetchMessages();
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0c1b33] flex items-center justify-center text-[#D4AF37]">
        Loading Staff Portal...
      </div>
    );
  }

  const handleAcceptJob = async (assignmentId: number) => {
    try {
      await acceptJobMutation.mutateAsync({ assignmentId });
      toast.success("Job accepted! ✅");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to accept job");
    }
  };

  const handleDeclineJob = async (assignmentId: number) => {
    try {
      await declineJobMutation.mutateAsync({ assignmentId });
      toast.error("Job declined");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to decline job");
    }
  };

  const handleCheckIn = async (assignmentId: number) => {
    if (!navigator.geolocation) {
      toast.error("GPS not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await checkInMutation.mutateAsync({
            assignmentId,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: "Current location",
            },
          });
          toast.success("Checked in! 📍");
          refetch();
        } catch (error: any) {
          toast.error(error.message || "Failed to check in");
        }
      },
      () => {
        toast.error("Please enable GPS");
      }
    );
  };

  const handleCheckOut = async (assignmentId: number) => {
    if (!navigator.geolocation) {
      toast.error("GPS not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await checkOutMutation.mutateAsync({
            assignmentId,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: "Current location",
            },
          });
          toast.success("Checked out! 👋");
          refetch();
        } catch (error: any) {
          toast.error(error.message || "Failed to check out");
        }
      },
      () => {
        toast.error("Please enable GPS");
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-300";
      case "declined":
        return "bg-red-100 text-red-800 border-red-300";
      case "invited":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Mobile */}
      <nav className="bg-[#0c1b33] border-b border-[#D4AF37]/20 py-3 px-4 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Crown className="text-[#D4AF37] w-5 h-5" />
              <span className="text-white font-bold tracking-wider text-xs uppercase">
                Royal Staff
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-[10px] uppercase font-bold">
              {user.name?.split(" ")[0]}
            </span>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* MY JOBS TAB */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0c1b33] uppercase tracking-wider">
              My Jobs
            </h2>

            {isLoading ? (
              <Card className="p-8 text-center">
                <p className="text-gray-400">Loading...</p>
              </Card>
            ) : !myJobs || myJobs.length === 0 ? (
              <Card className="p-12 text-center border-2 border-dashed">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-400 text-sm">No jobs assigned yet</p>
              </Card>
            ) : (
              myJobs.map((assignment) => (
                <Card key={assignment.id} className="p-4 border-l-4 border-l-[#D4AF37]">
                  <div className="space-y-3">
                    {/* Event Info */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-[#0c1b33] text-lg">
                          {assignment.event?.title || "Event"}
                        </h3>
                        <Badge className={`text-[10px] uppercase ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#D4AF37]" />
                          <span>{assignment.event?.eventDate ? new Date(assignment.event.eventDate).toLocaleDateString() : "TBD"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#D4AF37]" />
                          <span>{assignment.event?.location || "Location TBD"}</span>
                        </div>
                        {assignment.role && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-[#D4AF37]" />
                            <span className="font-medium">{assignment.role}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {assignment.status === "invited" && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleAcceptJob(assignment.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          disabled={acceptJobMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleDeclineJob(assignment.id)}
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                          disabled={declineJobMutation.isPending}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    )}

                    {assignment.status === "accepted" && !assignment.checkInTime && (
                      <Button
                        onClick={() => handleCheckIn(assignment.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={checkInMutation.isPending}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Check In
                      </Button>
                    )}

                    {assignment.checkInTime && !assignment.checkOutTime && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                          <CheckCircle className="w-4 h-4" />
                          <span>Checked in at {new Date(assignment.checkInTime).toLocaleTimeString()}</span>
                        </div>
                        <Button
                          onClick={() => handleCheckOut(assignment.id)}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                          disabled={checkOutMutation.isPending}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Check Out
                        </Button>
                      </div>
                    )}

                    {assignment.checkInTime && assignment.checkOutTime && (
                      <div className="space-y-1 text-sm bg-gray-50 p-3 rounded">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>In: {new Date(assignment.checkInTime).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-orange-600">
                          <Clock className="w-4 h-4" />
                          <span>Out: {new Date(assignment.checkOutTime).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0c1b33] uppercase tracking-wider">
              My Profile
            </h2>
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {myPhotos && myPhotos.length > 0 ? (
                  <img src={myPhotos[0].photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <h3 className="font-bold text-lg text-[#0c1b33] mb-1">{user.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{user.email}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadPhoto}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadPhotoMutation.isPending}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadPhotoMutation.isPending ? "Uploading..." : "Add Photo to Gallery"}
              </Button>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-[#0c1b33] mb-3">Photo Gallery ({myPhotos?.length || 0})</h3>
              <div className="grid grid-cols-3 gap-2">
                {myPhotos && myPhotos.length > 0 ? (
                  myPhotos.map((photo) => (
                    <div key={photo.id} className="aspect-square relative group">
                      <img
                        src={photo.photoUrl}
                        alt="Gallery"
                        className="w-full h-full object-cover rounded border-2 border-gray-200"
                      />
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={deletePhotoMutation.isPending}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 p-8 text-center text-gray-400 border-2 border-dashed rounded">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No photos yet. Upload your first photo!</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0c1b33] uppercase tracking-wider">
              Messages with Admin
            </h2>
            
            {/* Event Selector */}
            <Card className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Event to Message About
              </label>
              <select
                value={selectedEventId || ""}
                onChange={(e) => setSelectedEventId(e.target.value ? Number(e.target.value) : null)}
                className="w-full p-2 border rounded"
              >
                <option value="">General Message</option>
                {myJobs?.map((job) => (
                  <option key={job.id} value={job.event.id}>
                    {job.event.title} - {new Date(job.event.eventDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </Card>

            {/* Messages Thread */}
            <Card className="p-4 max-h-96 overflow-y-auto">
              {messages && messages.length > 0 ? (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${
                        msg.senderId === user.id
                          ? "bg-blue-100 ml-8"
                          : "bg-gray-100 mr-8"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {msg.senderId === user.id ? "You" : "Admin"}
                      </p>
                      <p className="text-sm text-gray-600">{msg.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No messages yet. Start a conversation!</p>
                </div>
              )}
            </Card>

            {/* Send Message */}
            <Card className="p-4">
              <div className="flex gap-2">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sendMessageMutation.isPending}
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-[#0c1b33]"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === "jobs" ? "text-[#D4AF37]" : "text-gray-400"
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px] uppercase font-bold">Jobs</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === "profile" ? "text-[#D4AF37]" : "text-gray-400"
            }`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-[10px] uppercase font-bold">Profile</span>
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === "messages" ? "text-[#D4AF37]" : "text-gray-400"
            }`}
          >
            <MessageSquare className="w-5 h-5 mb-1" />
            <span className="text-[10px] uppercase font-bold">Messages</span>
          </button>
        </div>
      </div>
    </div>
  );
}
