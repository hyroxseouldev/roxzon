"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";
import { useComments } from "@/hooks/use-posts";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

interface CommentsSectionProps {
  postId: string;
}

export const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const { data: comments, isLoading, error } = useComments(postId);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">댓글</h3>
            <Skeleton className="h-4 w-8" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />

            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>댓글을 불러오는데 실패했습니다.</p>
        </div>
      </Card>
    );
  }

  const commentsCount = comments?.length || 0;
  const totalRepliesCount =
    comments?.reduce(
      (total, comment) => total + (comment.replies?.length || 0),
      0
    ) || 0;
  const totalCommentsCount = commentsCount + totalRepliesCount;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* 댓글 헤더 */}
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="text-lg font-semibold">댓글</h3>
          <span className="text-muted-foreground">{totalCommentsCount}개</span>
        </div>

        {/* 댓글 작성 폼 */}
        <CommentForm postId={postId} />

        {/* 댓글 목록 */}
        <div className="space-y-6">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="group">
                <CommentItem comment={comment} postId={postId} />
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg mb-2">아직 댓글이 없습니다</p>
              <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
