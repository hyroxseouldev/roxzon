import { z } from "zod";

// HTML 태그를 제거하는 헬퍼 함수
const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>/g, "").trim();
};

// 게시글 작성 폼 스키마
export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요")
    .max(50, "제목은 50자 이내로 입력해주세요"),
  content: z
    .string()
    .refine(
      (val) => stripHtml(val).length >= 10,
      "내용을 10자 이상 입력해주세요"
    )
    .refine(
      (val) => stripHtml(val).length <= 5000,
      "내용은 5000자 이내로 입력해주세요"
    ),
  topic_id: z.string().min(1, "토픽을 선택해주세요"),
  images: z
    .array(z.instanceof(File))
    .max(5, "이미지는 최대 5개까지 업로드할 수 있습니다")
    .optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
