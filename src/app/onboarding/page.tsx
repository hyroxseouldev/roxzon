"use client";

import { useState, useEffect, useRef } from "react";
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

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: "",
    bio: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    if (user) {
      setProfileData({
        nickname:
          user.user_metadata?.full_name || user.user_metadata?.name || "",
        bio: "",
        avatar_url:
          user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
      });
    }
  }, [user, loading, router]);

  const handleImageUpload = async (file: File) => {
    if (!user) return;

    setIsUploading(true);

    try {
      // 임시로 파일을 Base64로 변환하여 사용 (Supabase Storage 설정 전까지)
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setProfileData((prev) => ({
          ...prev,
          avatar_url: base64String,
        }));
        setIsUploading(false);
      };
      reader.onerror = () => {
        console.error("파일 읽기 오류");
        toast.error("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);

      // Supabase Storage 사용 시 주석 해제
      /*
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 먼저 버킷 존재 확인
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('버킷 목록 조회 오류:', listError);
        throw new Error('스토리지 서비스에 접근할 수 없습니다.');
      }

      const bucketExists = buckets?.some(bucket => bucket.name === 'user-avatars');
      
      if (!bucketExists) {
        // 버킷 생성 시도
        const { error: createError } = await supabase.storage.createBucket('user-avatars', {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (createError) {
          console.error('버킷 생성 오류:', createError);
          throw new Error('스토리지 버킷을 생성할 수 없습니다.');
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('업로드 오류:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      setProfileData(prev => ({
        ...prev,
        avatar_url: data.publicUrl
      }));
      */
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
      // 먼저 기존 사용자가 있는지 확인
      const { data: existingUser, error: selectError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("Existing user:", existingUser);
      console.log("Select error:", selectError);

      const userData = {
        id: user.id,
        email: user.email!,
        nickname: profileData.nickname.trim(),
        bio: profileData.bio || null,
        avatar_url: profileData.avatar_url || null,
      };

      console.log("Updating user data:", userData);

      let result;
      if (selectError?.code === "PGRST116") {
        // 사용자가 없으면 INSERT
        result = await supabase.from("users").insert(userData);
        console.log("Insert result:", result);
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
        console.log("Update result:", result);
      }

      if (result.error) {
        console.error("프로필 저장 오류:", result.error);
        toast.error(`프로필 저장에 실패했습니다: ${result.error.message}`);
        return;
      }

      console.log("프로필 저장 성공");
      toast.success("프로필이 성공적으로 저장되었습니다!");
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

  if (loading) {
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
          <h1 className="text-2xl font-bold text-white mb-2">환영합니다! 🎉</h1>
          <p className="text-zinc-400">
            프로필을 설정하여 하이록스 커뮤니티를 시작해보세요
          </p>
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
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
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
                프로필 저장하고 시작하기
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
