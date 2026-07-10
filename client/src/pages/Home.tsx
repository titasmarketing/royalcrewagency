import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Crown, LayoutDashboard, Star, MapPin, Users, CheckCircle,
  Calendar, Clock, PartyPopper, ArrowRight, Zap, ShieldCheck,
  Award, TrendingUp, Package, Coffee, X, User as UserIcon, Building2, Check,
  Car, Camera, Menu, ArrowLeft, MessageCircle
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
function GallerySection() {
  const { data: photos } = trpc.gallery.featured.useQuery({ limit: 4 });
  const [, navigate] = useLocation();

  if (!photos || photos.length === 0) return null;

  return (
    <section className="py-32 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-[#D4AF37] text-xs font-bold tracking-[0.5em] uppercase block mb-4">Portfolio</span>
          <h2 className="text-5xl font-light text-[#0c1b33] tracking-tight uppercase">Our <span className="font-light text-[#D4AF37]">Events</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1b33]/90 via-[#0c1b33]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-lg mb-1">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-gray-300 text-sm">{photo.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate('/gallery')}
            variant="outline"
            className="h-14 px-12 tracking-[0.4em] border-[#D4AF37] text-[#0c1b33] hover:bg-[#D4AF37] hover:text-white"
          >
            View Gallery
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const workRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Booking Form State
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    type: 'Wedding',
    hours: 4,
    email: '',
    staffNeeds: [] as { type: string, count: number }[]
  });

  // Client Details Form (UK Compliant)
  const [clientData, setClientData] = useState({
    clientType: 'INDIVIDUAL' as 'INDIVIDUAL' | 'BUSINESS',
    name: '',
    companyName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    vatNumber: '',
  });

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch services dynamically from Admin → Services
  const { data: services } = trpc.services.list.useQuery();
  const staffTypes = services?.map(s => s.name.toUpperCase()) || [];

  const addStaff = (type: string) => {
    setBookingData(prev => {
      const existing = prev.staffNeeds.find(s => s.type === type);
      if (existing) return {
        ...prev,
        staffNeeds: prev.staffNeeds.map(s => s.type === type ? { ...s, count: s.count + 1 } : s)
      };
      return { ...prev, staffNeeds: [...prev.staffNeeds, { type, count: 1 }] };
    });
  };

  const removeStaff = (type: string) => {
    setBookingData(prev => {
      const existing = prev.staffNeeds.find(s => s.type === type);
      if (!existing) return prev;
      if (existing.count <= 1) {
        return { ...prev, staffNeeds: prev.staffNeeds.filter(s => s.type !== type) };
      }
      return {
        ...prev,
        staffNeeds: prev.staffNeeds.map(s => s.type === type ? { ...s, count: s.count - 1 } : s)
      };
    });
  };

  const handleStartBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.date || !bookingData.email || bookingData.staffNeeds.length === 0) {
      toast.error("Please fill in date, email and select at least one professional.");
      return;
    }
    setShowCompleteModal(true);
  };

  const createBookingMutation = trpc.events.createBooking.useMutation({
    onSuccess: () => {
      toast.success("Booking received! We'll contact you shortly.");
      setShowCompleteModal(false);
      // Reset forms
      setBookingData({ date: '', type: 'Wedding', hours: 4, email: '', staffNeeds: [] });
      setClientData({ clientType: 'INDIVIDUAL', name: '', companyName: '', phone: '', address: '', city: '', postalCode: '', vatNumber: '' });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!clientData.name || !clientData.phone || !clientData.address || !clientData.city || !clientData.postalCode) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Call backend
    createBookingMutation.mutate({
      clientType: clientData.clientType,
      name: clientData.name,
      email: bookingData.email,
      phone: clientData.phone,
      companyName: clientData.companyName || undefined,
      address: clientData.address,
      city: clientData.city,
      postalCode: clientData.postalCode,
      vatNumber: clientData.vatNumber || undefined,
      eventDate: bookingData.date,
      eventType: bookingData.type,
      serviceHours: bookingData.hours,
      location: `${clientData.address}, ${clientData.city}, ${clientData.postalCode}`,
      staffNeeds: bookingData.staffNeeds,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c1b33] font-sans selection:bg-[#D4AF37] selection:text-white relative">

      {/* Navbar Royal */}
      <nav className="bg-[#0c1b33]/90 backdrop-blur-md border-b border-[#D4AF37]/20 sticky top-0 z-50 py-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src="/uploads/images/gallery_1776897529584-r25iv.png" alt="Royal Crew Agency" className="h-16 w-auto" />
            </div>

            <div className="hidden md:flex items-center space-x-10">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors">Home</button>
              <button onClick={() => scrollTo(aboutRef)} className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors">About Us</button>
              <button onClick={() => scrollTo(servicesRef)} className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors">Services</button>
              <button onClick={() => scrollTo(galleryRef)} className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors">Gallery</button>
              <button onClick={() => scrollTo(workRef)} className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors">Work With Us</button>
              <button onClick={() => scrollTo(contactRef)} className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors">Contact Us</button>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/client" className="hidden md:block">
                <Button className="flex items-center gap-2 text-[10px] h-11 bg-[#D4AF37] text-[#0c1b33] hover:bg-[#D4AF37]/90 tracking-[0.3em]">
                  <LayoutDashboard className="w-4 h-4" /> CLIENT PORTAL
                </Button>
              </Link>
              {/* Hamburger mobile */}
              <button
                className="md:hidden text-[#D4AF37] p-2"
                onClick={() => setMobileMenuOpen(prev => !prev)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0c1b33] border-t border-[#D4AF37]/20 px-6 py-4 flex flex-col gap-4">
            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }} className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] text-left py-2 border-b border-[#D4AF37]/10">Home</button>
            <button onClick={() => { scrollTo(aboutRef); setMobileMenuOpen(false); }} className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] text-left py-2 border-b border-[#D4AF37]/10">About Us</button>
            <button onClick={() => { scrollTo(servicesRef); setMobileMenuOpen(false); }} className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] text-left py-2 border-b border-[#D4AF37]/10">Services</button>
            <button onClick={() => { scrollTo(galleryRef); setMobileMenuOpen(false); }} className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] text-left py-2 border-b border-[#D4AF37]/10">Gallery</button>
            <button onClick={() => { scrollTo(workRef); setMobileMenuOpen(false); }} className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] text-left py-2 border-b border-[#D4AF37]/10">Work With Us</button>
            <button onClick={() => { scrollTo(contactRef); setMobileMenuOpen(false); }} className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] text-left py-2 border-b border-[#D4AF37]/10">Contact Us</button>
            <Link href="/client" onClick={() => setMobileMenuOpen(false)}>
              <Button className="flex items-center gap-2 text-[10px] h-11 w-full bg-[#D4AF37] text-[#0c1b33] hover:bg-[#D4AF37]/90 tracking-[0.3em] mt-2">
                <LayoutDashboard className="w-4 h-4" /> CLIENT PORTAL
              </Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section with Quick Booking Form */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=2000&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#0c1b33'
        }}
      >
        <div className="absolute inset-0 bg-[#0c1b33]/75" />

        <div className="relative z-10 px-6 max-w-5xl mx-auto w-full flex flex-col items-center justify-center text-center space-y-8">
          {/* Hero Text */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 justify-center">
              <div className="h-px w-12 bg-[#D4AF37]"></div>
              <img src="/uploads/images/gallery_1776897529584-r25iv.png" alt="Royal Crew Agency" className="h-24 w-auto" />
              <div className="h-px w-12 bg-[#D4AF37]"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-light tracking-[0.1em] text-[#D4AF37] uppercase leading-tight">
              The Elite of <br />Hospitality
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide leading-relaxed italic max-w-2xl mx-auto">
              Elevating hospitality standards in Europe with elite staff for exclusive events.
            </p>
          </div>

          {/* Quick Booking Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-5xl">
            <h3 className="text-white font-bold tracking-[0.2em] uppercase text-sm mb-6 flex items-center gap-2 justify-center">
              <Zap className="w-4 h-4 text-[#D4AF37]" /> Instant Booking
            </h3>

            <form onSubmit={handleStartBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-white text-[10px] uppercase tracking-widest">Event Date</Label>
                  <Input
                    type="date"
                    value={bookingData.date}
                    onChange={e => setBookingData({ ...bookingData, date: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-[10px] uppercase tracking-widest">Event Type</Label>
                  <Select value={bookingData.type} onValueChange={value => setBookingData({ ...bookingData, type: value })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wedding">Wedding</SelectItem>
                      <SelectItem value="Corporate Gala">Corporate Gala</SelectItem>
                      <SelectItem value="VIP Private Party">VIP Private Party</SelectItem>
                      <SelectItem value="Exhibition">Exhibition</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-[10px] uppercase tracking-widest">Service Hours</Label>
                  <Input
                    type="number"
                    min="1"
                    value={bookingData.hours}
                    onChange={e => setBookingData({ ...bookingData, hours: parseInt(e.target.value) })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-[10px] uppercase tracking-widest">Contact Email</Label>
                  <Input
                    type="email"
                    value={bookingData.email}
                    onChange={e => setBookingData({ ...bookingData, email: e.target.value })}
                    required
                    placeholder="Ex: royal@event.uk"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Select Required Staff:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                  {staffTypes.length === 0 ? (
                    <p className="text-gray-500 text-xs col-span-full text-center py-4">No services available. Please add services in Admin → Services.</p>
                  ) : (
                    staffTypes.map(skill => {
                      const staffNeed = bookingData.staffNeeds.find(s => s.type === skill);
                      const isSelected = !!staffNeed;
                      return (
                        <div
                          key={skill}
                          className={`text-[9px] font-bold uppercase p-3 border rounded-lg transition-all flex justify-between items-center gap-1 ${isSelected ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                        >
                          <button type="button" onClick={() => addStaff(skill)} className="flex-1 text-left">
                            {skill}
                          </button>
                          {isSelected && (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => removeStaff(skill)}
                                className="bg-[#D4AF37]/30 hover:bg-[#D4AF37]/60 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] leading-none"
                              >−</button>
                              <span className="bg-[#D4AF37] text-[#0c1b33] px-1.5 py-0.5 rounded-full text-[8px] min-w-[16px] text-center">
                                {staffNeed.count}
                              </span>
                              <button
                                type="button"
                                onClick={() => addStaff(skill)}
                                className="bg-[#D4AF37]/30 hover:bg-[#D4AF37]/60 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] leading-none"
                              >+</button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full h-14 mt-6 tracking-[0.3em] bg-[#D4AF37] text-[#0c1b33] hover:bg-[#0c1b33] hover:text-white hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all border border-transparent hover:border-[#D4AF37]/50">
                Request Quote <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Events Delivered', value: '450+' },
            { label: 'Countries Covered', value: '12' },
            { label: 'Client Satisfaction', value: '99%' },
            { label: 'Elite Team', value: 'PROUDLY PUNCTUAL' },
          ].map((stat, i) => (
            <div key={i} className="text-center border-r border-gray-100 last:border-none">
              <p className="text-3xl font-bold text-[#0c1b33] mb-1 tracking-tighter">{stat.value}</p>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-32 bg-[#0a1426] relative z-20 overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Imagens e Estatísticas (Esquerda) */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-6 relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600"
                  alt="Luxury Event"
                  className="rounded-2xl shadow-2xl object-cover h-[400px] w-full mt-12"
                />
                <div className="space-y-6">
                  <img
                    src="/uploads/images/royalcrew-catering.jpg"
                    alt="Professional Staff"
                    className="rounded-2xl shadow-2xl object-cover h-[250px] w-full"
                  />
                  <div className="bg-gradient-to-br from-[#D4AF37] to-[#b38f20] rounded-2xl p-8 shadow-xl text-center">
                    <p className="text-4xl font-bold text-[#0c1b33] mb-1">12+</p>
                    <p className="text-[10px] uppercase font-bold text-[#0c1b33]/70 tracking-widest">Countries</p>
                    <p className="text-[10px] uppercase font-bold text-[#0c1b33]/70 tracking-widest">Covered in Europe</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-[#D4AF37]/20 rounded-2xl rotate-3 scale-[1.05] -z-10"></div>
            </div>

            {/* Conteúdo de Texto (Direita) */}
            <div className="space-y-10">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-8 bg-[#D4AF37]"></div>
                  <span className="text-[#D4AF37] text-xs font-bold tracking-[0.4em] uppercase">The Royal Standard</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-light tracking-tight leading-[1.1] mb-6">
                  Where <span className="text-[#D4AF37] italic font-serif">Elegance</span> <br />Meets Professionalism
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg font-light mb-4">
                  Royal Crew Agency is Europe's premier hospitality staffing solution, specializing in elite event management and professional staffing across 12 countries. We deliver exceptional service for weddings, corporate galas, VIP private parties, and exclusive events.
                </p>
                <p className="text-gray-400 leading-relaxed text-sm font-light">
                  We don't just supply staff; we provide comprehensive solutions that help our clients create exceptional experiences. From skilled porters and drivers to photographers and event coordinators, we connect you with experienced professionals who deliver efficiency, discretion, and excellence in every detail.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-white/10 pt-10">
                {/* 1. Events Delivered */}
                <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/45 hover:bg-white/[0.04] transition-all duration-500 group shadow-lg hover:shadow-[#D4AF37]/5">
                  <p className="text-4xl font-extralight bg-gradient-to-r from-[#D4AF37] to-[#F5E0A5] bg-clip-text text-transparent mb-2 tracking-tight">
                    450<span className="text-2xl font-light text-[#D4AF37]">+</span>
                  </p>
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-[0.2em] group-hover:text-white transition-colors">
                    Events Delivered
                  </p>
                </div>

                {/* 2. Client Satisfaction */}
                <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/45 hover:bg-white/[0.04] transition-all duration-500 group shadow-lg hover:shadow-[#D4AF37]/5">
                  <p className="text-4xl font-extralight bg-gradient-to-r from-[#D4AF37] to-[#F5E0A5] bg-clip-text text-transparent mb-2 tracking-tight">
                    99<span className="text-2xl font-light text-[#D4AF37]">%</span>
                  </p>
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-[0.2em] group-hover:text-white transition-colors">
                    Client Satisfaction
                  </p>
                </div>

                {/* 3. Verified */}
                <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/45 hover:bg-white/[0.04] transition-all duration-500 group shadow-lg hover:shadow-[#D4AF37]/5 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/50 transition-all duration-300">
                    <ShieldCheck className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em] group-hover:text-[#D4AF37] transition-colors">Verified</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      Rigorous background checks.
                    </p>
                  </div>
                </div>

                {/* 4. 24/7 Support */}
                <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/45 hover:bg-white/[0.04] transition-all duration-500 group shadow-lg hover:shadow-[#D4AF37]/5 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/50 transition-all duration-300">
                    <Clock className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em] group-hover:text-[#D4AF37] transition-colors">24/7 Support</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      Team available at any time.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-32 bg-[#0c1b33]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.5em] uppercase block mb-4">Our Expertise</span>
            <h2 className="text-5xl font-light tracking-tight uppercase"><span className="text-white">High-Level</span> <span className="text-[#D4AF37]">Team</span></h2>
          </div>

          <AnimatedTestimonials
            testimonials={[
              {
                name: "Professional Drivers",
                designation: "Elite Logistics",
                quote: "Fully qualified drivers for any job and anywhere in Europe. Our private chauffeurs ensure your travel is comfortable, discrete, and on time.",
                src: "/uploads/images/Wedding%20Chauffeur%20Hire.jpg",
                icon: Car
              },
              {
                name: "High Service",
                designation: "Premium Hospitality",
                quote: "Elite trained staff for any event and logistics standards. We bring impeccable attention to detail to ensure your guests receive the royal treatment.",
                src: "/uploads/images/Affordable%20Event%20Photography%20in%20DC_%20Quality%20Meets%20Budget%20-%20Event%20Photojournalism.jpg",
                icon: Users
              },
              {
                name: "VIP Reception",
                designation: "First Impressions",
                quote: "Multilingual hosts and reception models to make the best first impression. Elegance and professionalism tailored to your brand.",
                src: "/uploads/images/521323abfce3232744b5601568ebaa47.jpg",
                icon: Crown
              },
              {
                name: "Event Photographers",
                designation: "Capturing Memories",
                quote: "High-end event photography for sophisticated occasions, delivering discretion and elegance while ensuring every perfect moment is immortalized.",
                src: "/uploads/images/Love%20Stories%20in%20Focus_%20Finding%20the%20Dream%20Wedding%20Photographer%20for%20You%20-%20Photography%20Videography%20Services.jpg",
                icon: Camera
              },
              {
                name: "Coordinators",
                designation: "Seamless Execution",
                quote: "Expert team leaders dedicated to managing all staff logistics at the event venue. Ensuring everything runs perfectly from start to finish.",
                src: "/uploads/images/0615ebf387029cf001ac40192117862a.jpg",
                icon: ArrowRight
              },
              {
                name: "Support Team",
                designation: "Behind The Scenes",
                quote: "Highly efficient setup and quick cleaning staff so you don't have to worry about anything. The backbone of a flawlessly executed event.",
                src: "/uploads/images/Perfekte%20Location%20f%C3%BCr%20Ihres%20Catering.jpg",
                icon: Zap
              }
            ]}
          />
        </div>
      </section>

      {/* Gallery Section */}
      <section ref={galleryRef}>
        <GallerySection />
      </section>

      {/* Crown Section (substituiu o Menu) */}
      <section className="py-32 relative overflow-hidden" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-[#0c1b33]/90"></div>
        <div className="relative z-10 flex flex-col items-center justify-center py-16">
          <img src="/uploads/images/gallery_1776897529584-r25iv.png" alt="Royal Crew Agency" className="w-auto h-48 md:h-64 drop-shadow-[0_0_80px_rgba(212,175,55,0.6)]" />
        </div>
      </section>

      {/* Recruitment Section */}
      <section ref={workRef} className="py-32 bg-white text-center px-6">
        <div className="max-w-4xl mx-auto bg-[#f8fafc] p-12 md:p-20 rounded-3xl border border-gray-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <img src="/uploads/images/gallery_1776897529584-r25iv.png" alt="Royal Crew Agency" className="w-[400px] h-auto opacity-5" />
          </div>
          <div className="relative z-10">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.5em] uppercase block mb-6">Premium Careers</span>
            <h2 className="text-4xl md:text-5xl font-light text-[#0c1b33] mb-8">Want to Join the <span className="font-bold">Royal Crew?</span></h2>
            <p className="text-gray-500 mb-10 text-lg leading-relaxed max-w-2xl mx-auto italic">
              "We recruit only the best. If you have a passion for hospitality and excellence, this is your place."
            </p>
            <Link href="/work-with-us">
              <Button className="h-16 px-12 tracking-[0.4em] bg-[#0c1b33] text-white hover:bg-[#1a2e4d] shadow-2xl">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Completion Modal - UK Focused */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0c1b33]/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8 relative animate-in zoom-in duration-300">
            <button onClick={() => setShowCompleteModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500">
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-10">
              <img src="/uploads/images/gallery_1776897529584-r25iv.png" alt="Royal Crew Agency" className="w-12 h-auto mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#0c1b33] tracking-widest uppercase">Almost there!</h2>
              <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">Complete your details to finalise the booking</p>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setClientData({ ...clientData, clientType: 'INDIVIDUAL' })}
                  className={`flex-1 py-3 text-[10px] font-bold uppercase rounded-md transition-all ${clientData.clientType === 'INDIVIDUAL' ? 'bg-white shadow-sm text-[#0c1b33]' : 'text-gray-400'}`}
                >
                  <UserIcon className="w-3 h-3 inline mr-2" /> Individual
                </button>
                <button
                  type="button"
                  onClick={() => setClientData({ ...clientData, clientType: 'BUSINESS' })}
                  className={`flex-1 py-3 text-[10px] font-bold uppercase rounded-md transition-all ${clientData.clientType === 'BUSINESS' ? 'bg-white shadow-sm text-[#0c1b33]' : 'text-gray-400'}`}
                >
                  <Building2 className="w-3 h-3 inline mr-2" /> Business (UK)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{clientData.clientType === 'BUSINESS' ? 'Contact Name' : 'Full Name'}</Label>
                  <Input value={clientData.name} onChange={e => setClientData({ ...clientData, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={clientData.phone} onChange={e => setClientData({ ...clientData, phone: e.target.value })} required />
                </div>

                {clientData.clientType === 'BUSINESS' && (
                  <>
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input value={clientData.companyName} onChange={e => setClientData({ ...clientData, companyName: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>VAT Number (Optional)</Label>
                      <Input value={clientData.vatNumber} onChange={e => setClientData({ ...clientData, vatNumber: e.target.value })} />
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest border-b border-gray-100 pb-2">UK Address</p>
                <div className="space-y-2">
                  <Label>Address Line 1</Label>
                  <Input value={clientData.address} onChange={e => setClientData({ ...clientData, address: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={clientData.city} onChange={e => setClientData({ ...clientData, city: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Postcode (UK)</Label>
                    <Input placeholder="E.g. SW1A 1AA" value={clientData.postalCode} onChange={e => setClientData({ ...clientData, postalCode: e.target.value.toUpperCase() })} required />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full h-14 tracking-[0.4em] bg-[#0c1b33] text-white">
                  Confirm Booking <Check className="w-4 h-4 ml-2 inline-block" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Us Section */}
      <section ref={contactRef} className="py-32 bg-gradient-to-br from-[#0c1b33] to-[#050b1a] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.5em] uppercase block mb-4">Get In Touch</span>
            <h2 className="text-5xl font-light text-white tracking-tight uppercase">Contact <span className="font-light text-[#D4AF37]">Us</span></h2>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">Have questions or ready to book? Reach out to our team.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-4xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur border border-white/10 p-8 rounded-xl hover:border-[#D4AF37]/50 transition-all">
                <h3 className="text-[#D4AF37] font-bold text-sm uppercase tracking-widest mb-4">Email</h3>
                <a href="mailto:info@royalcrewagency.com" className="text-white text-lg hover:text-[#D4AF37] transition-colors">
                  info@royalcrewagency.com
                </a>
              </div>

              <div className="bg-white/5 backdrop-blur border border-white/10 p-8 rounded-xl hover:border-[#D4AF37]/50 transition-all">
                <h3 className="text-[#D4AF37] font-bold text-sm uppercase tracking-widest mb-4">WhatsApp</h3>
                <a href="https://wa.me/447700900000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white hover:text-[#D4AF37] transition-colors">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-lg">Message Us</span>
                </a>
              </div>

              <div className="bg-white/5 backdrop-blur border border-white/10 p-8 rounded-xl hover:border-[#D4AF37]/50 transition-all">
                <h3 className="text-[#D4AF37] font-bold text-sm uppercase tracking-widest mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm uppercase tracking-widest">Instagram</a>
                  <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm uppercase tracking-widest">LinkedIn</a>
                  <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm uppercase tracking-widest">Facebook</a>
                </div>
              </div>
            </div>

            {/* Quick Message */}
            <div className="bg-white/5 backdrop-blur border border-white/10 p-8 rounded-xl">
              <form className="space-y-4">
                <div>
                  <Label className="text-white text-xs uppercase tracking-widest">Name</Label>
                  <Input placeholder="Your name" className="bg-white/10 border-white/20 text-white mt-2" />
                </div>
                <div>
                  <Label className="text-white text-xs uppercase tracking-widest">Email</Label>
                  <Input type="email" placeholder="your@email.com" className="bg-white/10 border-white/20 text-white mt-2" />
                </div>
                <div>
                  <Label className="text-white text-xs uppercase tracking-widest">Message</Label>
                  <textarea placeholder="Your message..." className="w-full bg-white/10 border border-white/20 text-white rounded-lg p-3 mt-2 text-sm focus:outline-none focus:border-[#D4AF37]" rows={4}></textarea>
                </div>
                <Button className="w-full h-12 bg-[#D4AF37] text-[#0c1b33] hover:bg-[#D4AF37]/90 tracking-[0.3em] uppercase font-bold">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050b1a] text-gray-500 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex flex-col items-start mb-6">
                <img src="/uploads/images/gallery_1776897529584-r25iv.png" alt="Royal Crew Agency" className="h-20 w-auto" />
              </div>
              <p className="text-sm max-w-sm leading-relaxed">
                Elevating hospitality standards in Europe with elite staff for exclusive events.
              </p>
            </div>
            <div>
              <h4 className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest mb-6">Navigation</h4>
              <ul className="space-y-4 text-[10px] uppercase tracking-widest">
                <li className="hover:text-[#D4AF37] cursor-pointer" onClick={() => scrollTo(aboutRef)}>About Us</li>
                <li className="hover:text-[#D4AF37] cursor-pointer" onClick={() => scrollTo(servicesRef)}>Services</li>
                <li className="hover:text-[#D4AF37] cursor-pointer" onClick={() => scrollTo(galleryRef)}>Gallery</li>
                <li className="hover:text-[#D4AF37] cursor-pointer"><Link href="/work-with-us">Recruitment</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest mb-6">Legal</h4>
              <ul className="space-y-4 text-[10px] uppercase tracking-widest">
                <li className="hover:text-[#D4AF37] cursor-pointer">Terms of Service</li>
                <li className="hover:text-[#D4AF37] cursor-pointer">Privacy Policy</li>
                <li className="hover:text-[#D4AF37] cursor-pointer"><Link href="/admin">Admin</Link></li>
                <li className="hover:text-[#D4AF37] cursor-pointer"><Link href="/staff">Staff Portal</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-[10px] uppercase tracking-widest">
            <p>
              <a
                href="https://agencyl1.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors"
              >
                agencyl1.com &copy; <span dangerouslySetInnerHTML={{ __html: new Date().getFullYear().toString() }} />
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
