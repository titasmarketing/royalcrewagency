import { trpc } from "@/lib/trpc";

export function useAuth() {
  const { data: user, isLoading } = trpc.auth.me.useQuery();

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('auth_token');
    // Force page reload to clear tRPC cache and redirect to login
    window.location.href = '/login';
  };

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}

export function getLoginUrl() {
  return "/login";
}
