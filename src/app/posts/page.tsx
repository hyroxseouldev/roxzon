"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePosts } from "@/hooks/use-posts";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  AlertCircle,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
// import { dynamic } from "next/dynamic";

function PostsContent() {
  // 토픽 이름과 ID 매핑
  const topicMapping = {
    자유게시판: "0a29a8e9-c6ab-4cb9-8e3b-0cd920c5cbd8",
    파트너찾기: "12404483-42cc-44fb-b6ea-32df9e8bd953",
    티켓양도: "238278ec-2a26-4e18-badd-dc7afdbcf4b1",
    클래스: "543117a3-78b2-4cc1-b7f4-f02d9fa06c9b",
  };

  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedTopic = searchParams.get("topic") || "전체";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const selectedTopicId =
    selectedTopic === "전체"
      ? null
      : topicMapping[selectedTopic as keyof typeof topicMapping] || null;
  const postsPerPage = 15;

  // React Query hooks
  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = usePosts({
    topicId: selectedTopicId,
    page: currentPage,
    pageSize: postsPerPage,
  });

  const posts = postsData?.posts || [];
  const totalPages = Math.ceil((postsData?.totalCount || 0) / postsPerPage);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (selectedTopic !== "전체") {
      params.set("topic", selectedTopic);
    }
    params.set("page", page.toString());

    const queryString = params.toString();
    router.push(queryString ? `/posts?${queryString}` : "/posts");
  };

  const handleRetry = () => {
    refetchPosts();
  };

  // 로딩 상태 스켈레톤
  const PostSkeleton = () => (
    <Card className="bg-black border-none">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full bg-zinc-800" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-zinc-800" />
            <Skeleton className="h-3 w-16 bg-zinc-800" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4 bg-zinc-800" />
          <Skeleton className="h-4 w-full bg-zinc-800" />
          <Skeleton className="h-4 w-2/3 bg-zinc-800" />
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-12 bg-zinc-800" />
            <Skeleton className="h-6 w-16 bg-zinc-800" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* 에러 메시지 */}
      {postsError && (
        <Alert className="mb-6 bg-red-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{postsError?.message}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="ml-4 border-red-600 text-red-200 hover:bg-red-800"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* 게시글 목록 */}
      <div>
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {selectedTopic === "전체" ? "모든 게시글" : selectedTopic}
            </h1>
            <p className="text-zinc-400 text-sm">
              {postsData?.totalCount || 0}개의 게시글
            </p>
          </div>
          <Link href="/posts/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />새 게시글
            </Button>
          </Link>
        </div>

        {/* 게시글 목록 */}
        {postsLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card className="bg-black border-none">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <MessageSquare className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-400 mb-2">
                  {selectedTopic === "전체"
                    ? "아직 게시글이 없습니다."
                    : `${selectedTopic} 토픽에 게시글이 없습니다.`}
                </p>
                <p className="text-zinc-500 text-sm">
                  첫 번째 게시글을 작성해보세요!
                </p>
              </div>
              <Link href="/posts/create">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  게시글 작성하기
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
            >
              이전
            </Button>

            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const page = i + 1;
              const isCurrentPage = currentPage === page;

              return (
                <Button
                  key={page}
                  variant={isCurrentPage ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                  className={
                    isCurrentPage
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                  }
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
            >
              다음
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

// Force dynamic rendering to allow useSearchParams
export const dynamic = 'force-dynamic';

export default function PostsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostsContent />
    </Suspense>
  );
}
