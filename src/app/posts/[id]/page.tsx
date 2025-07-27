"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Instagram,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Trash2,
  Edit,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "@/components/protected-route";
import { usePost, useDeletePost, useToggleLike } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { CommentsSection } from "@/components/comments-section";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const { user } = useAuth();
  const { data: post, isLoading, error, refetch } = usePost(postId);
  const deletePostMutation = useDeletePost();
  const toggleLikeMutation = useToggleLike();

  // 게시글 삭제 핸들러
  const handleDeletePost = async () => {
    try {
      await deletePostMutation.mutateAsync(postId);
      toast.success("게시글이 삭제되었습니다.");
      router.push("/posts");
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      toast.error(
        error instanceof Error ? error.message : "게시글 삭제에 실패했습니다."
      );
    }
  };

  // 좋아요 토글 핸들러
  const handleToggleLike = async () => {
    if (!post) return;

    try {
      await toggleLikeMutation.mutateAsync(post.id);
      // React Query가 자동으로 캐시를 업데이트하지만 명시적으로 refetch
      refetch();
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      toast.error(
        error instanceof Error ? error.message : "좋아요 처리에 실패했습니다."
      );
    }
  };

  // 공유하기 핸들러
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.content,
          url: window.location.href,
        });
      } catch (error) {
        // 사용자가 공유를 취소한 경우
        if ((error as Error).name !== "AbortError") {
          console.error("공유 실패:", error);
        }
      }
    } else {
      // Web Share API를 지원하지 않는 경우 클립보드에 복사
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("링크가 클립보드에 복사되었습니다.");
      } catch (error) {
        console.error("클립보드 복사 실패:", error);
        toast.error("링크 복사에 실패했습니다.");
      }
    }
  };

  // 작성자인지 확인
  const isAuthor = user && post && user.id === post.user_id;

  // 로딩 상태
  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto max-w-4xl px-4 py-8">
            <div className="space-y-8">
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </Card>

              <Skeleton className="h-64 w-full rounded-lg" />

              <Card className="p-6">
                <Skeleton className="h-12 w-full" />
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto max-w-4xl px-4 py-8">
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                게시글을 찾을 수 없습니다
              </h2>
              <p className="text-muted-foreground mb-6">
                요청하신 게시글이 존재하지 않거나 삭제되었습니다.
              </p>
              <Link href="/posts">
                <Button>게시글 목록으로 이동</Button>
              </Link>
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="space-y-8">
            {/* 게시글 헤더 */}
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.users?.avatar_url || undefined} />
                  <AvatarFallback>
                    {post.users?.nickname?.slice(0, 2) || "익명"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {post.users?.nickname || "알 수 없는 사용자"}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatDistanceToNow(new Date(post.created_at), {
                              addSuffix: true,
                              locale: ko,
                            })}
                          </span>
                        </div>
                        {post.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{post.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* 토픽 배지 */}
                      {post.topics && (
                        <Badge
                          style={{ backgroundColor: post.topics.color }}
                          className="text-white"
                        >
                          {post.topics.name}
                        </Badge>
                      )}

                      {/* 작성자만 볼 수 있는 더보기 메뉴 */}
                      {isAuthor && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletePostMutation.isPending}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              수정하기
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  삭제하기
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    게시글 삭제
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    정말로 이 게시글을 삭제하시겠습니까? 삭제된
                                    게시글은 복구할 수 없습니다.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>취소</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeletePost}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    disabled={deletePostMutation.isPending}
                                  >
                                    {deletePostMutation.isPending && (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    삭제하기
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  <h1 className="text-2xl font-bold">{post.title}</h1>

                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {post.instagram_link && (
                    <div className="flex items-center space-x-2 text-purple-400">
                      <Instagram className="h-4 w-4" />
                      <a
                        href={
                          post.instagram_link.startsWith("http")
                            ? post.instagram_link
                            : `https://instagram.com/${post.instagram_link.replace(
                                "@",
                                ""
                              )}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                      >
                        {post.instagram_link}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* 게시글 이미지 */}
            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.images.map((imageUrl: string, index: number) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`게시글 이미지 ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* 게시글 액션 */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleLike}
                    disabled={toggleLikeMutation.isPending}
                    className={`flex items-center space-x-2 ${
                      post.isLiked ? "text-red-500" : ""
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        post.isLiked ? "fill-current text-red-500" : ""
                      }`}
                    />
                    <span>좋아요 {post.likes_count || 0}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>댓글 {post.comments_count || 0}</span>
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>

                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* 댓글 섹션 */}
            <CommentsSection postId={postId} />
          </div>
        </div>
      </div>
    </>
  );
}
