import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown, Image as ImageIcon, X } from "lucide-react";
import { Link } from "wouter";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Gallery() {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  const { data: photos } = trpc.gallery.list.useQuery();

  const categories = [
    { value: "all", label: "All Events" },
    { value: "weddings", label: "Weddings" },
    { value: "corporate_events", label: "Corporate Events" },
    { value: "private_parties", label: "Private Parties" },
    { value: "conferences", label: "Conferences" },
    { value: "gala_dinners", label: "Gala Dinners" },
    { value: "other", label: "Other" },
  ];

  const getCategoryLabel = (value: string) => {
    return categories.find((c) => c.value === value)?.label || value;
  };

  const filteredPhotos = photos?.filter((photo) => {
    if (filterCategory !== "all" && photo.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="bg-[#0c1b33]/95 backdrop-blur-md border-b border-[#D4AF37]/20 sticky top-0 z-50 py-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-20 items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img src="/manus-storage/royal-crew-logo-final_967d03a1.png" alt="Royal Crew Agency" className="h-16 w-auto" />
              </div>
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-[#D4AF37] text-white hover:bg-[#D4AF37] hover:text-[#0c1b33]"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0c1b33] to-[#1a2e4d] py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-[#D4AF37] text-xs font-bold tracking-[0.5em] uppercase block mb-6">
            Portfolio
          </span>
          <h1 className="text-6xl font-light text-white tracking-tight uppercase mb-6">
            Our <span className="font-bold text-[#D4AF37]">Gallery</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Explore our portfolio of exclusive events. From elegant weddings to high-profile corporate gatherings, see the Royal Crew standard in action.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Filter by:
              </span>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[220px] border-[#D4AF37]/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredPhotos?.length || 0} {filteredPhotos?.length === 1 ? "photo" : "photos"}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {!filteredPhotos || filteredPhotos.length === 0 ? (
            <div className="text-center py-32">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No photos yet</h3>
              <p className="text-gray-400">
                {filterCategory !== "all"
                  ? "Try selecting a different category"
                  : "Photos will appear here soon"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1b33]/95 via-[#0c1b33]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="mb-2">
                        <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                          {getCategoryLabel(photo.category)}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-1">{photo.title}</h3>
                      {photo.description && (
                        <p className="text-gray-300 text-sm line-clamp-2">{photo.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-6xl p-0 bg-[#0c1b33] border-[#D4AF37]/20">
          {selectedPhoto && (
            <div className="relative">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0c1b33] rounded-full p-2 transition-all"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full max-h-[80vh] object-contain"
              />
              <div className="p-8 bg-gradient-to-t from-[#0c1b33] to-transparent">
                <div className="mb-3">
                  <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                    {getCategoryLabel(selectedPhoto.category)}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">{selectedPhoto.title}</h2>
                {selectedPhoto.description && (
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {selectedPhoto.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-[#050b1a] text-gray-500 py-16 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center mb-6">
            <img src="/manus-storage/royal-crew-logo-final_967d03a1.png" alt="Royal Crew Agency" className="h-20 w-auto" />
          </div>
          <p className="text-xs uppercase tracking-widest">
            &copy; 2024 Royal Crew Agency. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
