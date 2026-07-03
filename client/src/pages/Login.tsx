import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Crown } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      toast.success(`Welcome back, ${data.user.name}!`);

      // Redirect based on role - use window.location for full reload
      const redirectUrl = data.user.role === "admin" ? "/admin/calendar" : data.user.role === "staff" ? "/staff/portal" : "/client";
      window.location.href = redirectUrl;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0c1b33] to-[#1a2942] p-4">
      <Card className="w-full max-w-md bg-[#1a2942] border-[#D4AF37]/20">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img src="/uploads/images/gallery_1776897529584-r25iv.png" alt="Royal Crew Agency" className="h-24 w-auto" />
          </div>
          <div>
            <CardDescription className="text-gray-400 mt-2">
              Sign in to your account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="bg-[#0c1b33] border-[#D4AF37]/20 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/register")}
              className="text-[#D4AF37] hover:text-[#B8941F] text-sm"
            >
              Don't have an account? Register
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
