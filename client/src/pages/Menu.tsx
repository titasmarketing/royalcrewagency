import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Crown } from "lucide-react";
import { useLocation } from "wouter";

const categories = [
  { value: "all", label: "All Items" },
  { value: "Starters", label: "Starters" },
  { value: "Mains", label: "Mains" },
  { value: "Desserts", label: "Desserts" },
  { value: "Drinks", label: "Drinks" },
  { value: "Canapés", label: "Canapés" },
  { value: "Other", label: "Other" },
];

export default function Menu() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: menuItems, isLoading } = trpc.menu.list.useQuery();

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems?.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0c1b33]">
      {/* Header */}
      <header className="border-b border-[#D4AF37]/20 bg-[#0c1b33]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Crown className="h-8 w-8 text-[#D4AF37]" />
              <span className="text-2xl font-bold text-white tracking-[0.2em]">
                ROYAL CREW
              </span>
            </button>

            {/* Back Button */}
            <button
              onClick={() => setLocation("/")}
              className="px-6 py-2.5 border-2 border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-[#0c1b33] transition-all font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 border-b border-[#D4AF37]/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our Premium Menu
            </h1>
            <p className="text-xl text-gray-300">
              Exquisite dishes crafted by our partner chefs for your luxury events.
              All items are priced per person and customizable to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-[#D4AF37]/20 bg-[#0c1b33]/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  selectedCategory === cat.value
                    ? "bg-[#D4AF37] text-[#0c1b33]"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-[#D4AF37]/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-400">
              {filteredItems?.length || 0} items available
            </p>
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent"></div>
              <p className="mt-4 text-gray-400">Loading menu...</p>
            </div>
          ) : filteredItems && filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 border border-[#D4AF37]/30 rounded-xl overflow-hidden hover:border-[#D4AF37] transition-all group"
                >
                  {/* Image */}
                  {item.imageUrl ? (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c1b33] via-transparent to-transparent opacity-60"></div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gradient-to-br from-[#D4AF37]/20 to-[#0c1b33] flex items-center justify-center">
                      <Crown className="h-16 w-16 text-[#D4AF37]/50" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                        {item.category}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                      {item.name}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-400 mb-4 line-clamp-3">
                        {item.description}
                      </p>
                    )}

                    {/* Ingredients */}
                    {item.ingredients && (
                      <div className="pt-4 border-t border-[#D4AF37]/20">
                        <p className="text-sm text-gray-500 mb-2 font-semibold">
                          Ingredients:
                        </p>
                        <p className="text-sm text-gray-400">{item.ingredients}</p>
                      </div>
                    )}



                    {/* Note */}
                    <div className="mt-4 pt-4 border-t border-[#D4AF37]/20">
                      <p className="text-xs text-gray-500 italic">
                        Priced per person • Contact us for quotes
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Crown className="h-16 w-16 text-[#D4AF37]/50 mx-auto mb-4" />
              <p className="text-xl text-gray-400">
                No menu items available in this category
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-[#D4AF37]/20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Interested in Our Menu?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              All menu items can be customized for your event. Contact us to discuss
              your requirements and get a personalized quote.
            </p>
            <button
              onClick={() => setLocation("/")}
              className="px-8 py-4 bg-[#D4AF37] text-[#0c1b33] rounded-lg hover:bg-[#D4AF37]/90 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
            >
              Request a Quote
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D4AF37]/20 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 Royal Crew Agency. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
