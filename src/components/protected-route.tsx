"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireProfile?: boolean;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
  requireProfile = false,
}: ProtectedRouteProps) {
  const { user, userProfile, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // 로딩 중이면 아무것도 하지 않음

    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // 프로필이 필요한 페이지에서 프로필이 없으면 온보딩으로 리다이렉트
    if (requireProfile && user && !userProfile?.nickname) {
      router.push("/onboarding");
      return;
    }
  }, [
    isAuthenticated,
    loading,
    router,
    redirectTo,
    requireProfile,
    user,
    userProfile,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center space-x-2 text-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>로딩 중...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireProfile && user && !userProfile?.nickname) {
    return null;
  }

  return <>{children}</>;
}
