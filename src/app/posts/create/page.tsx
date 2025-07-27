"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ProtectedRoute from "@/components/protected-route";
import { useTopics, useCreatePost } from "@/hooks/use-posts";
import { createPostSchema, CreatePostFormData } from "@/lib/schemas";
import { RichTextEditor } from "@/components/rich-text-editor";

export default function CreatePostPage() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string>("");

  const { data: topics = [], isLoading: topicsLoading } = useTopics();
  const createPostMutation = useCreatePost();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
      topic_id: "",
      images: [],
    },
  });

  const watchedValues = watch();

  // 페이지 이탈 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue =
          "작성 중인 내용이 있습니다. 정말 페이지를 떠나시겠습니까?";
        return e.returnValue;
      }
    };

    const handlePopState = () => {
      if (isDirty) {
        const shouldLeave = confirm(
          "작성 중인 내용이 있습니다. 정말 페이지를 떠나시겠습니까?"
        );
        if (!shouldLeave) {
          window.history.pushState(null, "", window.location.href);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty]);

  // 폼 값 변경 감지
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (
        name &&
        (value.title ||
          value.content ||
          value.topic_id ||
          selectedImages.length > 0)
      ) {
        setIsDirty(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, selectedImages.length]);

  // 폼 validation 강제 트리거 (Rich Text Editor 변경 시)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchedValues.content) {
        trigger("content");
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [watchedValues.content, trigger]);

  // 이미지 업로드 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + selectedImages.length > 5) {
      toast.error("이미지는 최대 5개까지 업로드할 수 있습니다.");
      return;
    }

    // 파일 크기 및 타입 검증
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(
          `${file.name} 파일이 너무 큽니다. 5MB 이하의 파일을 선택해주세요.`
        );
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          `${file.name} 파일 형식이 지원되지 않습니다. JPG, PNG, WebP 파일을 선택해주세요.`
        );
        return;
      }
    }

    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);
    setValue("images", newImages, { shouldValidate: true });
    setIsDirty(true);

    // 미리보기 URL 생성
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  // 이미지 제거
  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);

    // 메모리 해제
    URL.revokeObjectURL(previewUrls[index]);

    setSelectedImages(newImages);
    setPreviewUrls(newPreviewUrls);
    setValue("images", newImages, { shouldValidate: true });
  };

  // 콘텐츠 변경 핸들러
  const handleContentChange = (content: string) => {
    setValue("content", content, { shouldValidate: true });
    setIsDirty(true);
  };

  // 폼 제출
  const onSubmit = async (data: CreatePostFormData) => {
    try {
      // 상태 메시지 업데이트
      if (data.images && data.images.length > 0) {
        setSubmitStatus(`이미지 ${data.images.length}개 업로드 중...`);
      } else {
        setSubmitStatus("게시글 작성 중...");
      }

      // 게시글 작성 API 호출
      const newPost = await createPostMutation.mutateAsync(data);

      setSubmitStatus("작성 완료! 페이지 이동 중...");
      setIsDirty(false); // 성공 시 dirty 상태 해제
      toast.success("게시글이 성공적으로 작성되었습니다!");

      // 성공 시 생성된 게시글 페이지로 이동
      router.push(`/posts/${newPost.id}`);
    } catch (error) {
      console.error("게시글 작성 실패:", error);
      setSubmitStatus(""); // 에러 시 상태 초기화

      // 실패 시 구체적인 에러 메시지 표시
      if (error instanceof Error) {
        if (error.message.includes("이미지 업로드")) {
          toast.error(
            "이미지 업로드에 실패했습니다. 이미지 파일을 확인해주세요."
          );
        } else if (error.message.includes("네트워크")) {
          toast.error("네트워크 연결을 확인해주세요.");
        } else if (error.message.includes("크기")) {
          toast.error(
            "이미지 파일 크기가 너무 큽니다. 5MB 이하의 파일을 사용해주세요."
          );
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("게시글 작성에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    if (isDirty) {
      const shouldLeave = confirm(
        "작성 중인 내용이 있습니다. 정말 취소하시겠습니까?"
      );
      if (!shouldLeave) return;
    }
    router.push("/posts");
  };

  return (
    <ProtectedRoute requireProfile={true}>
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto max-w-4xl p-6">
          {/* 헤더 */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white mb-4"
              onClick={handleCancel}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              게시글 목록으로 돌아가기
            </Button>

            <h1 className="text-3xl font-bold flex items-center">
              <PlusCircle className="h-8 w-8 mr-3 text-blue-400" />새 게시글
              작성
            </h1>
            <p className="text-zinc-400 mt-2">
              운동 경험과 정보를 커뮤니티와 공유해보세요!
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col space-y-6">
              {/* 메인 폼 */}
              <div className="space-y-6">
                {/* 기본 정보 카드 */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white">기본 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 제목 */}
                    <div>
                      <Label htmlFor="title" className="text-white mb-2 block">
                        제목 *
                      </Label>
                      <Input
                        id="title"
                        {...register("title")}
                        placeholder="게시글 제목을 입력하세요"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.title ? (
                          <p className="text-red-400 text-sm">
                            {errors.title.message}
                          </p>
                        ) : (
                          <div />
                        )}
                        <p className="text-zinc-500 text-sm">
                          {watchedValues.title?.length || 0}/50자
                        </p>
                      </div>
                    </div>

                    {/* 토픽 선택 */}
                    <div>
                      <Label htmlFor="topic" className="text-white mb-2 block">
                        토픽 *
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          setValue("topic_id", value, { shouldValidate: true });
                          setIsDirty(true);
                        }}
                        value={watchedValues.topic_id}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="토픽을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          {topicsLoading ? (
                            <SelectItem value="" disabled>
                              로딩 중...
                            </SelectItem>
                          ) : (
                            topics.map((topic) => (
                              <SelectItem
                                key={topic.id}
                                value={topic.id}
                                className="text-white hover:bg-zinc-700"
                              >
                                {topic.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.topic_id && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.topic_id.message}
                        </p>
                      )}
                    </div>

                    {/* 내용 - Rich Text Editor */}
                    <div>
                      <Label
                        htmlFor="content"
                        className="text-white mb-2 block"
                      >
                        내용 *
                      </Label>
                      <RichTextEditor
                        content={watchedValues.content}
                        onChange={handleContentChange}
                        placeholder="운동 경험, 팁, 정보 등을 자세히 설명해주세요..."
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.content ? (
                          <p className="text-red-400 text-sm">
                            {errors.content.message}
                          </p>
                        ) : (
                          <div />
                        )}
                        <p className="text-zinc-500 text-sm">
                          {watchedValues.content?.replace(/<[^>]*>/g, "").trim()
                            .length || 0}
                          /5000자 (최소 10자)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 이미지 업로드 카드 */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      이미지 업로드
                    </CardTitle>
                    <p className="text-zinc-400 text-sm">
                      운동 관련 사진을 첨부해보세요 (최대 5개)
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* 업로드 버튼 */}
                      <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-zinc-600 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                          disabled={selectedImages.length >= 5}
                        />
                        <Label
                          htmlFor="image-upload"
                          className={`cursor-pointer ${
                            selectedImages.length >= 5
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                        >
                          <Upload className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                          <p className="text-zinc-400">
                            {selectedImages.length >= 5
                              ? "최대 5개까지 업로드 가능합니다"
                              : "클릭하여 이미지를 선택하세요"}
                          </p>
                          <p className="text-zinc-500 text-sm mt-1">
                            JPG, PNG, WebP 파일 지원 (최대 5MB)
                          </p>
                        </Label>
                      </div>

                      {/* 이미지 미리보기 */}
                      {previewUrls.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {previewUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg bg-zinc-800"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.images && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.images.message}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 게시글 작성 가이드 카드 */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white text-sm">
                    게시글 작성 가이드
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-zinc-400 space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mt-2"></div>
                    <span>운동 방법이나 경험을 구체적으로 설명해주세요</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-green-400 rounded-full mt-2"></div>
                    <span>초보자도 이해하기 쉽게 작성해주세요</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2"></div>
                    <span>관련 이미지를 첨부하면 더 도움이 됩니다</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mt-2"></div>
                    <span>서로를 존중하며 건설적인 내용을 작성해주세요</span>
                  </div>
                </CardContent>
              </Card>

              {/* 토픽 정보 카드 */}
              {watchedValues.topic_id && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">
                      선택된 토픽
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const selectedTopic = topics.find(
                        (t) => t.id === watchedValues.topic_id
                      );
                      return selectedTopic ? (
                        <div className="space-y-2">
                          <h3 className="text-white font-medium">
                            {selectedTopic.name}
                          </h3>
                          {selectedTopic.description && (
                            <p className="text-zinc-400 text-sm">
                              {selectedTopic.description}
                            </p>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 에러 메시지 */}
            {createPostMutation.error && (
              <Alert className="bg-red-900 border-red-700">
                <AlertDescription>
                  {createPostMutation.error.message}
                </AlertDescription>
              </Alert>
            )}

            {/* 제출 버튼 */}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                disabled={isSubmitting}
                onClick={handleCancel}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                title={
                  !isValid
                    ? `폼이 유효하지 않습니다. 에러: ${Object.keys(errors).join(
                        ", "
                      )}`
                    : ""
                }
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{submitStatus || "작성 중..."}</span>
                  </div>
                ) : (
                  "게시글 작성"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
