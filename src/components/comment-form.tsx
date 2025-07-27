"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCreateComment } from "@/hooks/use-posts";
import { toast } from "sonner";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  placeholder?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export const CommentForm = ({
  postId,
  parentId,
  placeholder = "댓글을 입력하세요...",
  onSuccess,
  onCancel,
  showCancel = false,
}: CommentFormProps) => {
  const { user, userProfile } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createCommentMutation = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("댓글 내용을 입력해주세요.");
      return;
    }

    if (content.length > 2000) {
      toast.error("댓글은 2000자 이내로 작성해주세요.");
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        postId,
        commentData: {
          content: content.trim(),
          parent_id: parentId,
        },
      });

      setContent("");
      toast.success(
        parentId ? "답글이 작성되었습니다." : "댓글이 작성되었습니다."
      );
      onSuccess?.();
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      toast.error(
        error instanceof Error ? error.message : "댓글 작성에 실패했습니다."
      );
    }
  };

  if (!user) {
    return (
      <div className="text-center text-muted-foreground py-4">
        댓글을 작성하려면 로그인이 필요합니다.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={userProfile?.avatar_url || undefined} />
          <AvatarFallback>
            {userProfile?.nickname?.slice(0, 2) || "익명"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="resize-none"
            disabled={createCommentMutation.isPending}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {content.length}/2000
            </div>

            <div className="flex space-x-2">
              {showCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={createCommentMutation.isPending}
                >
                  취소
                </Button>
              )}

              <Button
                type="submit"
                size="sm"
                disabled={createCommentMutation.isPending || !content.trim()}
              >
                {createCommentMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {parentId ? "답글 작성" : "댓글 작성"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
