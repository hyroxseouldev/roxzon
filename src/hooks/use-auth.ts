"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // URL에서 토큰 제거 (OAuth 리다이렉트 후)
    const cleanupUrl = () => {
      try {
        if (typeof window !== 'undefined' && window.location) {
          const url = new URL(window.location.href);
          if (url.hash && (url.hash.includes('access_token') || url.hash.includes('refresh_token'))) {
            // URL에서 토큰 제거
            window.history.replaceState({}, document.title, url.pathname + url.search);
          }
        }
      } catch (error) {
        console.error('URL 정리 중 오류:', error);
      }
    };
    
    // 현재 세션 확인
    const getSession = async () => {
      try {
        // 세션 확인
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('세션 확인 에러:', error);
          setUser(null);
          setUserProfile(null);
          return;
        }
        setUser(session?.user ?? null);
        
        // 사용자가 있으면 프로필 정보도 로드
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        
        // 세션 확인 후 URL 정리
        cleanupUrl();
      } catch (error) {
        console.error('세션 확인 오류:', error);
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setUser(session?.user ?? null);
          
          // 사용자가 있으면 프로필 정보도 로드
          if (session?.user) {
            await loadUserProfile(session.user.id);
          } else {
            setUserProfile(null);
          }
        } catch (error) {
          console.error('인증 상태 변경 처리 오류:', error);
          // 오류 발생 시 안전한 상태로 설정
          setUser(null);
          setUserProfile(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.error('구독 해제 중 오류:', error);
      }
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    if (!userId) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('프로필 로드 오류:', error);
        setUserProfile(null);
        return;
      }

      setUserProfile(profile);
    } catch (error) {
      console.error('프로필 로드 중 오류:', error);
      setUserProfile(null);
    }
  };

  const checkUserProfile = async (userId: string) => {
    if (!userId) return false;
    
    try {
      const { data: existingUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('프로필 확인 오류:', error);
        return false;
      }

      // 프로필이 완성되었는지 확인
      return !!(existingUser && existingUser.nickname && existingUser.nickname !== '익명');
    } catch (error) {
      console.error('프로필 확인 중 오류:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      // 로딩 상태 설정
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('로그아웃 오류:', error);
        toast.error('로그아웃에 실패했습니다. 다시 시도해주세요.');
        return;
      }
      
      // 상태 초기화
      setUser(null);
      setUserProfile(null);
      
      // 로그아웃 성공 시 홈페이지로 리다이렉트
      toast.success('로그아웃되었습니다.');
      
      // 페이지 새로고침 대신 라우터 사용
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
      toast.error('로그아웃에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    userProfile,
    loading: loading || !mounted,
    signOut,
    checkUserProfile,
    loadUserProfile,
    isAuthenticated: !!user && mounted,
  };
};