"use client";

import { useTopics } from "@/hooks/use-posts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

// Force dynamic rendering to allow useSearchParams
export const dynamic = 'force-dynamic';

function TopicSidebar() {
  // 토픽 이름과 ID 매핑
  const topicMapping = {
    자유게시판: "0a29a8e9-c6ab-4cb9-8e3b-0cd920c5cbd8",
    파트너찾기: "12404483-42cc-44fb-b6ea-32df9e8bd953",
    티켓양도: "238278ec-2a26-4e18-badd-dc7afdbcf4b1",
    클래스: "543117a3-78b2-4cc1-b7f4-f02d9fa06c9b",
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTopic = searchParams.get("topic") || "전체";

  const { data: topics = [], isLoading: topicsLoading } = useTopics();

  const handleTopicChange = (topicName: string) => {
    const params = new URLSearchParams();
    if (topicName !== "전체") {
      params.set("topic", topicName);
    }
    params.set("page", "1");

    const queryString = params.toString();
    router.push(queryString ? `/posts?${queryString}` : "/posts");
  };

  const allTopics = [{ name: "전체", id: null }, ...topics];

  return (
    <div className="sticky top-6">
      <Card className="bg-black border-none mb-4">
        <CardContent className="pt-0">
          <div className="space-y-1">
            {topicsLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full bg-zinc-800" />
                ))}
              </div>
            ) : (
              allTopics.map((topic) => (
                <Button
                  key={topic.name}
                  variant={selectedTopic === topic.name ? "default" : "ghost"}
                  className={`w-full justify-start text-left text-sm ${
                    selectedTopic === topic.name
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                  onClick={() => handleTopicChange(topic.name)}
                >
                  {topic.name}
                </Button>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RightSidebar() {
  const searchParams = useSearchParams();
  const selectedTopic = searchParams.get("topic") || "전체";

  const { data: topics = [] } = useTopics();

  return (
    <div className="sticky top-6 space-y-4">
      {/* 토픽 정보 카드 */}
      <Card className="bg-black border-none">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-bold text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
            {selectedTopic === "전체" ? "커뮤니티 정보" : selectedTopic}
          </h3>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <p className="text-zinc-400 text-sm">
              {selectedTopic === "전체"
                ? "하이록스 커뮤니티에 오신 것을 환영합니다! 다양한 운동 정보와 경험을 공유해보세요."
                : `${selectedTopic} 토픽에서 관련 정보를 공유해보세요.`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 게시글 작성 가이드 카드 */}
      <Card className="bg-black border-none">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-400" />
            게시글 작성 가이드
          </h3>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 text-sm text-zinc-400">
            <div className="flex items-start space-x-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full mt-2"></div>
              <span>운동 경험과 팁을 자유롭게 공유해보세요</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1 h-1 bg-green-400 rounded-full mt-2"></div>
              <span>서로를 존중하며 건설적인 대화를 나누세요</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2"></div>
              <span>질문이 있다면 언제든 편하게 물어보세요</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-7xl p-6">
        {/* 2:5:3 그리드 레이아웃 */}
        <div className="grid grid-cols-10 gap-6">
          {/* 좌측 토픽 메뉴 (2/10) */}
          <div className="col-span-2">
            <Suspense fallback={<div>Loading topics...</div>}>
              <TopicSidebar />
            </Suspense>
          </div>

          {/* 중앙 메인 컨텐츠 (5/10) */}
          <div className="col-span-5">{children}</div>

          {/* 우측 토픽 정보 (3/10) */}
          <div className="col-span-3">
            <Suspense fallback={<div>Loading sidebar...</div>}>
              <RightSidebar />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
