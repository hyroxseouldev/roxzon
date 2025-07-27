"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user, userProfile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    nickname: "",
    bio: "",
    avatar_url: "",
  });

  const loadProfileData = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // AuthProvider에서 이미 로드된 userProfile 사용
      if (userProfile) {
        setProfileData({
          nickname: userProfile.nickname || "",
          bio: userProfile.bio || "",
          avatar_url: userProfile.avatar_url || "",
        });
      } else {
        // userProfile이 없으면 직접 DB에서 가져오기
        const { data: existingUser, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("프로필 로드 오류:", error);
          toast.error("프로필을 불러오는데 실패했습니다.");
          return;
        }

        if (existingUser) {
          const avatarUrl =
            existingUser.avatar_url ||
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            "";

          setProfileData({
            nickname: existingUser.nickname || "",
            bio: existingUser.bio || "",
            avatar_url: avatarUrl,
          });
        } else {
          // 기존 사용자가 없으면 기본값 설정
          const avatarUrl =
            user.user_metadata?.avatar_url || user.user_metadata?.picture || "";

          setProfileData({
            nickname:
              user.user_metadata?.full_name || user.user_metadata?.name || "",
            bio: "",
            avatar_url: avatarUrl,
          });
        }
      }
    } catch (error) {
      console.error("프로필 로드 중 오류:", error);
      toast.error("프로필을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [user, userProfile]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadProfileData();
    }
  }, [user, loading, loadProfileData, router]);

  const handleImageUpload = async (file: File) => {
    if (!user) return;

    setIsUploading(true);

    try {
      // Base64로 이미지 처리
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setProfileData((prev) => ({
          ...prev,
          avatar_url: base64String,
        }));
        toast.success("이미지가 업로드되었습니다!");
        setIsUploading(false);
      };
      reader.onerror = () => {
        console.error("파일 읽기 오류");
        toast.error("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      toast.error(
        `이미지 업로드에 실패했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

    handleImageUpload(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    if (!profileData.nickname.trim()) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 사용자 세션 확인
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      // 먼저 기존 사용자가 있는지 확인
      const { data: existingUser, error: selectError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      const userData = {
        id: user.id,
        email: user.email!,
        nickname: profileData.nickname.trim(),
        bio: profileData.bio || null,
        avatar_url: profileData.avatar_url || null,
      };

      let result;
      if (selectError?.code === "PGRST116") {
        // 사용자가 없으면 INSERT
        result = await supabase.from("users").insert(userData);
      } else {
        // 사용자가 있으면 UPDATE
        result = await supabase
          .from("users")
          .update({
            nickname: userData.nickname,
            bio: userData.bio,
            avatar_url: userData.avatar_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      }

      if (result.error) {
        console.error("프로필 저장 오류:", result.error);
        toast.error(`프로필 저장에 실패했습니다: ${result.error.message}`);
        return;
      }

      // 헤더의 아바타 업데이트를 위해 프로필 다시 로드
      await refreshProfile();

      toast.success("프로필이 성공적으로 수정되었습니다!");
      router.push("/");
    } catch (error) {
      console.error("프로필 처리 중 오류:", error);
      toast.error(
        `프로필 저장에 실패했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>로딩 중...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md bg-zinc-900 rounded-lg shadow-2xl p-8 border border-zinc-800">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">프로필 수정</h1>
          <p className="text-zinc-400">프로필 정보를 수정하고 저장하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24 mb-4 border-2 border-zinc-700">
                <AvatarImage src={profileData.avatar_url} alt="프로필 사진" />
                <AvatarFallback className="text-lg bg-zinc-800 text-white">
                  {profileData.nickname.charAt(0) ||
                    user.email?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute -bottom-1 -right-1 bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 rounded-full w-8 h-8 p-0"
                onClick={triggerFileSelect}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-zinc-500 text-center">
              프로필 사진을 변경하려면 카메라 버튼을 클릭하세요
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              value={user.email || ""}
              disabled
              className="bg-zinc-800 border-zinc-700 text-zinc-400 cursor-not-allowed"
            />
            <p className="text-xs text-zinc-500">구글 이메일이 고정됩니다</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-white">
              닉네임 (20자 이내)
            </Label>
            <Input
              id="nickname"
              type="text"
              value={profileData.nickname}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  nickname: e.target.value.slice(0, 20),
                }))
              }
              placeholder="닉네임을 입력해주세요"
              maxLength={20}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600"
            />
            <p className="text-xs text-zinc-500 text-right">
              {profileData.nickname.length}/20
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">
              자기소개 (200자 이내)
            </Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  bio: e.target.value.slice(0, 200),
                }))
              }
              placeholder="자신을 간단히 소개해주세요"
              rows={4}
              maxLength={200}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600 resize-none"
            />
            <p className="text-xs text-zinc-500 text-right">
              {profileData.bio.length}/200
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0"
            size="lg"
            disabled={
              isSubmitting || !profileData.nickname.trim() || isUploading
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                프로필 수정 완료
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
