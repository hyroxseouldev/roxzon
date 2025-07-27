"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Edit,
  Trash2,
  Reply,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Comment } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateComment, useDeleteComment } from "@/hooks/use-posts";
import { CommentForm } from "./comment-form";
import { toast } from "sonner";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  isReply?: boolean;
}

export const CommentItem = ({
  comment,
  postId,
  isReply = false,
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { user } = useAuth();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();

  const isAuthor = user && user.id === comment.user_id;
  const isDeleted = comment.is_deleted;

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast.error("댓글 내용을 입력해주세요.");
      return;
    }

    if (editContent.length > 2000) {
      toast.error("댓글은 2000자 이내로 작성해주세요.");
      return;
    }

    try {
      await updateCommentMutation.mutateAsync({
        commentId: comment.id,
        content: editContent.trim(),
      });

      setIsEditing(false);
      toast.success("댓글이 수정되었습니다.");
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      toast.error(
        error instanceof Error ? error.message : "댓글 수정에 실패했습니다."
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCommentMutation.mutateAsync(comment.id);
      toast.success("댓글이 삭제되었습니다.");
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      toast.error(
        error instanceof Error ? error.message : "댓글 삭제에 실패했습니다."
      );
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  if (isDeleted) {
    return (
      <div className={`flex space-x-3 ${isReply ? "ml-11" : ""}`}>
        <div className="flex-1 py-3">
          <div className="text-muted-foreground text-sm italic">
            삭제된 댓글입니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${isReply ? "ml-11" : ""}`}>
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.users?.avatar_url || undefined} />
          <AvatarFallback>
            {comment.users?.nickname?.slice(0, 2) || "익명"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm">
                {comment.users?.nickname || "알 수 없는 사용자"}
              </span>
              <span className="text-muted-foreground text-xs">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>
              {comment.is_edited && (
                <span className="text-muted-foreground text-xs">(수정됨)</span>
              )}
            </div>

            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-3 w-3" />
                    수정
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        삭제
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                          정말로 이 댓글을 삭제하시겠습니까? 삭제된 댓글은
                          복구할 수 없습니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          삭제
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="resize-none text-sm"
                disabled={updateCommentMutation.isPending}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {editContent.length}/2000
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={updateCommentMutation.isPending}
                  >
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleEdit}
                    disabled={
                      updateCommentMutation.isPending || !editContent.trim()
                    }
                  >
                    수정
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-6 px-2"
                >
                  <Heart className="mr-1 h-3 w-3" />
                  <span className="text-xs">{comment.likes_count}</span>
                </Button>

                {!isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="text-muted-foreground hover:text-foreground h-6 px-2"
                  >
                    <Reply className="mr-1 h-3 w-3" />
                    <span className="text-xs">답글</span>
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 답글 작성 폼 */}
      {showReplyForm && !isReply && (
        <div className="ml-11">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            placeholder="답글을 입력하세요..."
            onSuccess={() => setShowReplyForm(false)}
            onCancel={() => setShowReplyForm(false)}
            showCancel={true}
          />
        </div>
      )}

      {/* 답글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
