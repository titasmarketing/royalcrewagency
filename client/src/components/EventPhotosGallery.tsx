import { trpc } from "@/lib/trpc";
import { Camera, User, Clock } from "lucide-react";

interface EventPhotosGalleryProps {
  eventId: number;
}

export default function EventPhotosGallery({ eventId }: EventPhotosGalleryProps) {
  const { data: photos, isLoading } = trpc.staff.getEventPhotos.useQuery({ eventId });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-400">Loading photos...</p>
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <Camera className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-sm text-gray-400">No photos uploaded yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Staff will upload photos during check-in
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={photo.photoUrl}
                alt={photo.caption || "Event photo"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Info */}
            <div className="p-3 space-y-2">
              {photo.caption && (
                <p className="text-sm text-gray-700 font-medium line-clamp-2">
                  {photo.caption}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <User className="w-3 h-3" />
                <span>{photo.staffName || "Staff"}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{new Date(photo.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Hover overlay para ampliar */}
            <a
              href={photo.photoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">
                View Full Size
              </span>
            </a>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-[#D4AF37]">{photos.length}</span> photo{photos.length !== 1 ? "s" : ""} uploaded
        </p>
      </div>
    </div>
  );
}
