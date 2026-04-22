import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef } from "react";
import { Crown, CheckCircle, Users, DollarSign, Calendar, Star, Building2, Camera, X, Smartphone, Download } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function RecruitmentPortal() {
  const [activeTab, setActiveTab] = useState("individual");
  const [submittedIndividual, setSubmittedIndividual] = useState(false);
  const [submittedCompany, setSubmittedCompany] = useState(false);
  
  // Individual form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    county: "",
    postcode: "",
    bio: "",
    experience: "",
    specialties: [] as string[],
    hourlyRate: "",
  });

  // Photo upload state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPhotoPreview(result);
      setPhotoBase64(result);
      setPhotoMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  // Company form data
  const [companyData, setCompanyData] = useState({
    companyName: "",
    businessType: "catering" as const,
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    county: "",
    postcode: "",
    servicesOffered: "",
    description: "",
    website: "",
  });

  const createApplicationMutation = trpc.recruitment.createApplication.useMutation({
    onSuccess: () => {
      setSubmittedIndividual(true);
      toast.success("Application submitted successfully!");
    },
    onError: (error: any) => {
      toast.error("Error submitting application: " + error.message);
    },
  });

  const createCompanyMutation = trpc.partnerCompanies.create.useMutation({
    onSuccess: () => {
      setSubmittedCompany(true);
      toast.success("Company application submitted successfully!");
    },
    onError: (error: any) => {
      toast.error("Error submitting company application: " + error.message);
    },
  });

  const handleIndividualSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    createApplicationMutation.mutate({
      ...formData,
      photoBase64: photoBase64 || undefined,
      photoMimeType: photoMimeType || undefined,
    });
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyData.companyName || !companyData.contactPerson || !companyData.email || !companyData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    createCompanyMutation.mutate(companyData);
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const { data: servicesData } = trpc.services.list.useQuery();
  const availableSpecialties = servicesData?.map((s: any) => s.name) ?? [];

  const businessTypes = [
    { value: "catering", label: "Catering & Food Services" },
    { value: "photography_video", label: "Photography & Videography" },
    { value: "chef_services", label: "Chef Services" },
    { value: "decoration", label: "Decoration & Flowers" },
    { value: "sound_lighting", label: "Sound & Lighting" },
    { value: "transportation", label: "Transportation & Valet" },
    { value: "security", label: "Security Services" },
    { value: "cleaning", label: "Cleaning Services" },
    { value: "other", label: "Other Services" },
  ];

  // Success screen for individual
  if (submittedIndividual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-2 border-accent/20">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Thank you for applying to Royal Crew Agency. Our team will review your profile and
              we will contact you soon.
            </p>
            <div className="bg-accent/10 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-2">Next Steps:</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-accent">1.</span>
                  <span>Profile review by our team (1-2 business days)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">2.</span>
                  <span>Online or in-person interview (if approved)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">3.</span>
                  <span>Training and team integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">4.</span>
                  <span>Start receiving job opportunities!</span>
                </li>
              </ul>
            </div>
            {/* App Download Section */}
            <div className="border-t border-accent/20 pt-6 mb-6">
              <h3 className="font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                <Smartphone className="h-4 w-4 text-accent" />
                Install the Staff App
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Once approved, you'll use our app to manage your jobs, check-in at events and share your location.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/install"
                  className="inline-flex items-center justify-center gap-2 bg-[#0c1b33] text-white px-5 py-3 rounded-xl font-medium text-sm hover:bg-[#0c1b33]/90 transition-colors"
                >
                  <span className="text-lg">🍎</span>
                  <div className="text-left">
                    <div className="text-[10px] text-white/60 leading-none">Add to Home Screen</div>
                    <div className="text-sm font-semibold leading-tight">iPhone / iPad</div>
                  </div>
                </a>
                <a
                  href="/install"
                  className="inline-flex items-center justify-center gap-2 bg-[#0c1b33] text-white px-5 py-3 rounded-xl font-medium text-sm hover:bg-[#0c1b33]/90 transition-colors"
                >
                  <span className="text-lg">🤖</span>
                  <div className="text-left">
                    <div className="text-[10px] text-white/60 leading-none">Install App</div>
                    <div className="text-sm font-semibold leading-tight">Android</div>
                  </div>
                </a>
              </div>
            </div>
            <Button onClick={() => (window.location.href = "/")} size="lg">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success screen for company
  if (submittedCompany) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-2 border-accent/20">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Company Application Submitted!
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Thank you for your interest in partnering with Royal Crew Agency. Our team will review your company details and contact you soon.
            </p>
            <div className="bg-accent/10 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-2">Next Steps:</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-accent">1.</span>
                  <span>Company verification (2-3 business days)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">2.</span>
                  <span>Partnership agreement discussion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">3.</span>
                  <span>Contract signing and onboarding</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">4.</span>
                  <span>Start receiving collaboration opportunities!</span>
                </li>
              </ul>
            </div>
            <Button onClick={() => (window.location.href = "/")} size="lg">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Header */}
      <header className="border-b bg-[#0c1b33] backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => (window.location.href = "/")}>
            <img src="/royal-crew-logo.png" alt="Royal Crew Agency" className="h-12 w-auto" />
          </div>
          <Button 
            variant="outline" 
            onClick={() => (window.location.href = "/")}
            className="border-[#D4AF37]/30 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            Back to Home
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
              <Crown className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Work With Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Join the <span className="text-accent">Premium</span> Team
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join the best event professionals in the market. Work at exclusive events,
              earn well and build your career with Royal Crew Agency.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-1">Great Pay</h3>
                <p className="text-sm text-muted-foreground">Above market average rates</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-1">Flexibility</h3>
                <p className="text-sm text-muted-foreground">You choose when to work</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-1">Premium Events</h3>
                <p className="text-sm text-muted-foreground">Work at exclusive events</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-1">Top Team</h3>
                <p className="text-sm text-muted-foreground">Work with the best</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="individual" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Individual Professional
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Partner Company
              </TabsTrigger>
            </TabsList>

            {/* Individual Form */}
            <TabsContent value="individual">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Application Form</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fill in your details to apply. Fields marked with * are required.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleIndividualSubmit} className="space-y-6">
                    {/* Profile Photo */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Profile Photo <span className="text-red-500">*</span></h3>
                      <div className="flex items-center gap-6">
                        <div
                          className="relative w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#D4AF37] transition-colors bg-gray-50"
                          onClick={() => photoInputRef.current?.click()}
                        >
                          {photoPreview ? (
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-gray-400">
                              <Camera className="w-8 h-8" />
                              <span className="text-[10px] text-center">Add Photo</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Upload your photo</p>
                          <p className="text-xs text-muted-foreground">JPG, PNG or WEBP. Max 5MB.<br/>Clear face photo required.</p>
                          <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => photoInputRef.current?.click()}>
                              <Camera className="w-3 h-3 mr-2" /> Choose Photo
                            </Button>
                            {photoPreview && (
                              <Button type="button" variant="outline" size="sm" onClick={() => { setPhotoPreview(null); setPhotoBase64(null); setPhotoMimeType(null); }}>
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </div>

                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Smith"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@email.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+44 20 1234 5678"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="123 High Street, Flat 4"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="London"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="county">County</Label>
                          <Input
                            id="county"
                            value={formData.county}
                            onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                            placeholder="Greater London"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postcode">Postcode</Label>
                          <Input
                            id="postcode"
                            value={formData.postcode}
                            onChange={(e) => setFormData({ ...formData, postcode: e.target.value.toUpperCase() })}
                            placeholder="SW1A 1AA"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Specialties / Roles</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {availableSpecialties.map((specialty) => (
                              <div key={specialty} className="flex items-center space-x-2">
                                <Checkbox
                                  id={specialty}
                                  checked={formData.specialties.includes(specialty)}
                                  onCheckedChange={() => handleSpecialtyToggle(specialty)}
                                />
                                <label
                                  htmlFor={specialty}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {specialty}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experience">Professional Experience</Label>
                          <Textarea
                            id="experience"
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            placeholder="Describe your professional experience in the events industry..."
                            rows={4}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="hourlyRate">Expected Hourly Rate (£)</Label>
                          <Input
                            id="hourlyRate"
                            type="number"
                            value={formData.hourlyRate}
                            onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                            placeholder="35"
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={createApplicationMutation.isPending}>
                      {createApplicationMutation.isPending ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Company Form */}
            <TabsContent value="company">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Partner Company Application</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Register your company to become a Royal Crew partner. Fields marked with * are required.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCompanySubmit} className="space-y-6">
                    {/* Company Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Company Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            value={companyData.companyName}
                            onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                            placeholder="Your Company Ltd"
                            required
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="businessType">Business Type *</Label>
                          <Select
                            value={companyData.businessType}
                            onValueChange={(value: any) => setCompanyData({ ...companyData, businessType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {businessTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactPerson">Contact Person *</Label>
                          <Input
                            id="contactPerson"
                            value={companyData.contactPerson}
                            onChange={(e) => setCompanyData({ ...companyData, contactPerson: e.target.value })}
                            placeholder="John Smith"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyEmail">Email *</Label>
                          <Input
                            id="companyEmail"
                            type="email"
                            value={companyData.email}
                            onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                            placeholder="contact@company.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyPhone">Phone *</Label>
                          <Input
                            id="companyPhone"
                            value={companyData.phone}
                            onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                            placeholder="+44 20 1234 5678"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={companyData.website}
                            onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                            placeholder="https://yourcompany.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Company Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="companyAddress">Address</Label>
                          <Input
                            id="companyAddress"
                            value={companyData.address}
                            onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                            placeholder="123 Business Park"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyCity">City</Label>
                          <Input
                            id="companyCity"
                            value={companyData.city}
                            onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                            placeholder="London"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyCounty">County</Label>
                          <Input
                            id="companyCounty"
                            value={companyData.county}
                            onChange={(e) => setCompanyData({ ...companyData, county: e.target.value })}
                            placeholder="Greater London"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyPostcode">Postcode</Label>
                          <Input
                            id="companyPostcode"
                            value={companyData.postcode}
                            onChange={(e) => setCompanyData({ ...companyData, postcode: e.target.value.toUpperCase() })}
                            placeholder="SW1A 1AA"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Services & Description */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Services & Description</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="servicesOffered">Services Offered</Label>
                          <Textarea
                            id="servicesOffered"
                            value={companyData.servicesOffered}
                            onChange={(e) => setCompanyData({ ...companyData, servicesOffered: e.target.value })}
                            placeholder="List the main services your company provides..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Company Description</Label>
                          <Textarea
                            id="description"
                            value={companyData.description}
                            onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                            placeholder="Tell us about your company, experience, and what makes you unique..."
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={createCompanyMutation.isPending}>
                      {createCompanyMutation.isPending ? "Submitting..." : "Submit Company Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
