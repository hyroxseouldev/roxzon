import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Clock,
  Instagram,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Post } from "@/lib/api";
import { useState } from "react";
import { useToggleLike } from "@/hooks/use-posts";
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
}

const DIFFICULTY_COLORS = {
  초급: "bg-green-500 hover:bg-green-600",
  중급: "bg-yellow-500 hover:bg-yellow-600",
  고급: "bg-red-500 hover:bg-red-600",
};

// date-fns로 더 정확한 날짜 포맷팅
const formatDate = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: ko,
  });
};

// HTML 태그를 제거하는 헬퍼 함수
const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>/g, "").trim();
};

export const PostCard = ({ post }: PostCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const toggleLike = useToggleLike();

  // HTML 태그 제거된 텍스트 콘텐츠
  const textContent = stripHtml(post.content || "");
  const isContentLong = textContent.length > 100;
  const displayContent = showFullContent
    ? textContent
    : textContent.slice(0, 100);

  // 서버에서 받은 좋아요 상태 사용
  const isLiked = post.isLiked || false;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 로딩 상태 처리
    if (toggleLike.isPending) return;

    try {
      await toggleLike.mutateAsync(post.id);
      // React Query가 자동으로 캐시를 무효화하고 업데이트함
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      toast.error("좋아요 처리에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: post.title,
      text: textContent.slice(0, 50) + "...",
      url: `${window.location.origin}/posts/${post.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // 사용자가 공유를 취소한 경우는 에러로 처리하지 않음
        if ((error as Error).name !== "AbortError") {
          console.error("공유 실패:", error);
          fallbackShare(shareData.url);
        }
      }
    } else {
      fallbackShare(shareData.url);
    }
  };

  const fallbackShare = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("링크가 클립보드에 복사되었습니다.");
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  return (
    <Card className="bg-black border-none hover:bg-zinc-900/30 transition-all duration-200 group">
      {/* 카드 헤더 */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-zinc-700">
              <AvatarImage src={post.users?.avatar_url || undefined} />
              <AvatarFallback className="bg-zinc-700 text-zinc-200">
                {post.users?.nickname?.charAt(0) || "익명"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                {post.users?.nickname || "알 수 없는 사용자"}
              </p>
              <div className="flex items-center space-x-2 text-sm text-zinc-400">
                <Clock className="h-3 w-3" />
                <span>{formatDate(post.created_at)}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-white"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* 카드 콘텐츠 */}
      <CardContent className="pt-0">
        <Link href={`/posts/${post.id}`}>
          <div className="cursor-pointer space-y-3">
            {/* 제목 */}
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* 본문 미리보기 */}
            <div className="text-zinc-300 text-sm leading-relaxed">
              <p className={showFullContent ? "" : "line-clamp-3"}>
                {displayContent}
                {isContentLong && !showFullContent && "..."}
              </p>
              {isContentLong && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowFullContent(!showFullContent);
                  }}
                  className="text-blue-400 hover:text-blue-300 text-xs mt-1 font-medium"
                >
                  {showFullContent ? "접기" : "더보기"}
                </button>
              )}
            </div>

            {/* 이미지 (있는 경우) */}
            {post.images && post.images.length > 0 && (
              <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden">
                <img
                  src={post.images[0]}
                  alt="Post image"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            )}

            {/* 추가 정보 */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {post.difficulty && (
                <Badge
                  className={`${
                    DIFFICULTY_COLORS[
                      post.difficulty as keyof typeof DIFFICULTY_COLORS
                    ]
                  } text-white border-0 text-xs`}
                >
                  {post.difficulty}
                </Badge>
              )}
              {post.topics?.name && (
                <Badge
                  variant="outline"
                  className="text-zinc-300 border-zinc-600 hover:bg-zinc-700 text-xs"
                >
                  {post.topics.name}
                </Badge>
              )}
              {post.location && (
                <div className="flex items-center text-zinc-400">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="text-xs">{post.location}</span>
                </div>
              )}
              {post.instagram_link && (
                <div className="flex items-center text-pink-400">
                  <Instagram className="h-3 w-3 mr-1" />
                  <span className="text-xs">Instagram</span>
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* 인터랙션 버튼들 */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800 mt-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={toggleLike.isPending}
              className={`text-sm px-2 h-8 ${
                isLiked
                  ? "text-red-500 hover:text-red-400"
                  : "text-zinc-400 hover:text-red-500"
              } transition-colors disabled:opacity-50`}
            >
              <Heart
                className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`}
              />
              <span>{post.likes_count || 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-blue-400 transition-colors text-sm px-2 h-8"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{post.comments_count || 0}</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-zinc-400 hover:text-green-400 transition-colors p-2 h-8 w-8"
            >
              <Share2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={`p-2 h-8 w-8 transition-colors ${
                isBookmarked
                  ? "text-yellow-500 hover:text-yellow-400"
                  : "text-zinc-400 hover:text-yellow-500"
              }`}
            >
              <Bookmark
                className={`h-3 w-3 ${isBookmarked ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
