import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Crown } from "lucide-react";

export default function Register() {
  const [, navigate] = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "client" | "staff">("client");

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      toast.success(`Welcome, ${data.user.name}!`);

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin/calendar");
      } else if (data.user.role === "staff") {
        navigate("/staff/portal");
      } else {
        navigate("/client");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0c1b33] to-[#1a2942] p-4">
      <Card className="w-full max-w-md bg-[#1a2942] border-[#D4AF37]/20">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img src="/royal-crew-logo.png" alt="Royal Crew Agency" className="h-24 w-auto" />
          </div>
          <div>
            <CardDescription className="text-gray-400 mt-2">
              Create your account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-[#0c1b33] border-[#D4AF37]/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#0c1b33] border-[#D4AF37]/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-[#0c1b33] border-[#D4AF37]/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">I am a...</Label>
              <Select value={role} onValueChange={(v) => setRole(v as any)}>
                <SelectTrigger className="bg-[#0c1b33] border-[#D4AF37]/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="staff">Staff Member</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-[#D4AF37] hover:text-[#B8941F] text-sm"
            >
              Already have an account? Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
