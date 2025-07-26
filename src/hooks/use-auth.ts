"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 현재 세션 확인
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);

        // 로그인 시 사용자 상태만 업데이트 (리다이렉트 제거)
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUserProfile = async (userId: string) => {
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
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('로그아웃 오류:', error);
        toast.error('로그아웃에 실패했습니다. 다시 시도해주세요.');
        return;
      }
      
      // 로그아웃 성공 시 홈페이지로 리다이렉트
      toast.success('로그아웃되었습니다.');
      window.location.href = '/';
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
      toast.error('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return {
    user,
    loading,
    signOut,
    checkUserProfile,
    isAuthenticated: !!user,
  };
};