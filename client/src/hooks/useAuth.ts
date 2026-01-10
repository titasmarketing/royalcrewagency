import { trpc } from "@/lib/trpc";

export function useAuth() {
  const { data: user, isLoading } = trpc.auth.me.useQuery();

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    // Force full page reload to /login to clear all cache
    window.location.replace('/login');
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
