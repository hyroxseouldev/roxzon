"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loadUserProfile: (userId: string) => Promise<UserProfile | null>;
  checkUserProfile: (userId: string) => Promise<boolean>;
  isAuthenticated: boolean;
  hasProfile: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // 사용자 프로필 로드
  const loadUserProfile = useCallback(
    async (userId: string): Promise<UserProfile | null> => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("프로필 로드 오류:", error);
          return null;
        }

        return data;
      } catch (error) {
        console.error("프로필 로드 중 예외:", error);
        return null;
      }
    },
    []
  );

  // 사용자 프로필 생성
  const createUserProfile = useCallback(
    async (user: User): Promise<UserProfile | null> => {
      try {
        const profileData = {
          id: user.id,
          email: user.email!,
          nickname: user.user_metadata?.full_name || "사용자",
          avatar_url: user.user_metadata?.avatar_url || null,
          bio: null,
        };

        const { data, error } = await supabase
          .from("users")
          .insert(profileData)
          .select()
          .single();

        if (error) {
          console.error("프로필 생성 오류:", error);
          return null;
        }

        return data;
      } catch (error) {
        console.error("프로필 생성 중 예외:", error);
        return null;
      }
    },
    []
  );

  // 사용자 프로필 확인 및 로드
  const checkAndLoadProfile = useCallback(
    async (user: User) => {
      if (!isMounted) return;

      let profile = await loadUserProfile(user.id);

      if (!profile) {
        // 프로필이 없으면 생성
        profile = await createUserProfile(user);

        if (!profile) {
          console.error("프로필을 생성할 수 없습니다.");
          return;
        }

        // 첫 로그인이므로 온보딩 페이지로 리디렉션
        router.push("/onboarding");
        return;
      }

      setUserProfile(profile);
    },
    [loadUserProfile, createUserProfile, router, isMounted]
  );

  // 프로필 새로고침
  const refreshProfile = useCallback(async () => {
    if (!user || !isMounted) return;

    const profile = await loadUserProfile(user.id);
    if (profile) {
      setUserProfile(profile);
    }
  }, [user, loadUserProfile, isMounted]);

  // 프로필 완성 여부 확인
  const checkUserProfile = useCallback(
    async (userId: string): Promise<boolean> => {
      if (!userId) return false;
      const profile = await loadUserProfile(userId);
      return !!(profile?.nickname && profile.nickname !== "익명");
    },
    [loadUserProfile]
  );

  // 로그아웃
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      router.push("/");
      toast.success("로그아웃되었습니다.");
    } catch (error) {
      console.error("로그아웃 오류:", error);
      toast.error("로그아웃 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 컴포넌트 마운트 상태 추적
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // 초기 세션 확인 및 인증 상태 변화 리스너
  useEffect(() => {
    if (!isMounted) return;

    // 초기 세션 확인
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("세션 확인 오류:", error);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          await checkAndLoadProfile(session.user);
        }
      } catch (error) {
        console.error("인증 초기화 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 인증 상태 변화 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log("Auth state changed:", event, session?.user?.id);

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        await checkAndLoadProfile(session.user);

        // 초기 로딩이 아닌 경우에만 성공 메시지 표시
        if (!loading) {
          toast.success("로그인되었습니다.");
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isMounted, checkAndLoadProfile, loading]);

  const value = {
    user,
    userProfile,
    loading,
    signOut,
    refreshProfile,
    loadUserProfile,
    checkUserProfile,
    isAuthenticated: !!user,
    hasProfile: !!(userProfile?.nickname && userProfile.nickname !== "익명"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
