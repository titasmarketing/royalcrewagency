import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle, Instagram, Linkedin, Facebook } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminContactSettings() {
  const [contactInfo, setContactInfo] = useState({
    email: "info@royalcrewagency.com",
    whatsapp: "+447700900000",
    instagram: "",
    linkedin: "",
    facebook: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Integrar com tRPC para salvar no banco de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Contact information updated successfully!");
    } catch (error) {
      toast.error("Failed to save contact information");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Contact Settings</h1>
          <p className="text-muted-foreground">Manage your contact information displayed on the website</p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-accent" />
                <CardTitle>Email Address</CardTitle>
              </div>
              <CardDescription>Primary contact email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  placeholder="info@royalcrewagency.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-accent" />
                <CardTitle>WhatsApp</CardTitle>
              </div>
              <CardDescription>WhatsApp contact number</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">Phone Number (with country code)</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={contactInfo.whatsapp}
                  onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                  placeholder="+447700900000"
                />
              </div>
            </CardContent>
          </Card>

          {/* Instagram */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-accent" />
                <CardTitle>Instagram</CardTitle>
              </div>
              <CardDescription>Instagram profile URL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input
                  id="instagram"
                  type="url"
                  value={contactInfo.instagram}
                  onChange={(e) => setContactInfo({ ...contactInfo, instagram: e.target.value })}
                  placeholder="https://instagram.com/royalcrewagency"
                />
              </div>
            </CardContent>
          </Card>

          {/* LinkedIn */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-accent" />
                <CardTitle>LinkedIn</CardTitle>
              </div>
              <CardDescription>LinkedIn profile URL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={contactInfo.linkedin}
                  onChange={(e) => setContactInfo({ ...contactInfo, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/royalcrewagency"
                />
              </div>
            </CardContent>
          </Card>

          {/* Facebook */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Facebook className="w-5 h-5 text-accent" />
                <CardTitle>Facebook</CardTitle>
              </div>
              <CardDescription>Facebook page URL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input
                  id="facebook"
                  type="url"
                  value={contactInfo.facebook}
                  onChange={(e) => setContactInfo({ ...contactInfo, facebook: e.target.value })}
                  placeholder="https://facebook.com/royalcrewagency"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-accent hover:bg-accent/90 text-white px-8 h-12"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
