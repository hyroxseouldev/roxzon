"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Target,
  MapPin,
  Heart,
  MessageCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackgroundPaths } from "@/components/ui/background-path";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { user, loading, checkUserProfile, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkProfile = async () => {
      if (!loading && isAuthenticated && user) {
        const hasCompleteProfile = await checkUserProfile(user.id);
        if (!hasCompleteProfile) {
          router.push('/onboarding');
        }
      }
    };

    checkProfile();
  }, [user, loading, isAuthenticated, checkUserProfile, router]);
  const currentPage = 1;
  const totalPages = 5;

  const communityPosts = [
    {
      id: 1,
      title: "15분 하체 집중 HIIT",
      author: "트레이너김",
      difficulty: "중급",
      location: "강남구",
      likes: 24,
      comments: 8,
      timeAgo: "2시간 전",
    },
    {
      id: 2,
      title: "초보자를 위한 전신 운동",
      author: "피트니스러버",
      difficulty: "초급",
      location: "마포구",
      likes: 18,
      comments: 5,
      timeAgo: "5시간 전",
    },
    {
      id: 3,
      title: "코어 강화 20분 루틴",
      author: "운동매니아",
      difficulty: "고급",
      location: "송파구",
      likes: 31,
      comments: 12,
      timeAgo: "1일 전",
    },
    {
      id: 4,
      title: "아침 운동 루틴 추천",
      author: "새벽운동러",
      difficulty: "초급",
      location: "서초구",
      likes: 15,
      comments: 3,
      timeAgo: "1일 전",
    },
    {
      id: 5,
      title: "다이어트 성공 후기",
      author: "다이어터",
      difficulty: "중급",
      location: "용산구",
      likes: 42,
      comments: 18,
      timeAgo: "2일 전",
    },
    {
      id: 6,
      title: "홈트 공간 꾸미기 팁",
      author: "홈트마스터",
      difficulty: "초급",
      location: "노원구",
      likes: 27,
      comments: 9,
      timeAgo: "2일 전",
    },
    {
      id: 7,
      title: "근력운동과 유산소 조합",
      author: "피트니스코치",
      difficulty: "고급",
      location: "강남구",
      likes: 35,
      comments: 14,
      timeAgo: "3일 전",
    },
    {
      id: 8,
      title: "운동 후 회복 음식",
      author: "건강식단러",
      difficulty: "중급",
      location: "마포구",
      likes: 22,
      comments: 7,
      timeAgo: "3일 전",
    },
    {
      id: 9,
      title: "무릎 부상 예방 운동",
      author: "재활전문가",
      difficulty: "초급",
      location: "강서구",
      likes: 19,
      comments: 4,
      timeAgo: "4일 전",
    },
    {
      id: 10,
      title: "크로스핏 입문기",
      author: "크로스핏러버",
      difficulty: "고급",
      location: "송파구",
      likes: 38,
      comments: 16,
      timeAgo: "4일 전",
    },
    {
      id: 11,
      title: "스트레칭의 중요성",
      author: "유연성마스터",
      difficulty: "초급",
      location: "성북구",
      likes: 16,
      comments: 6,
      timeAgo: "5일 전",
    },
    {
      id: 12,
      title: "운동 동기부여 방법",
      author: "모티베이터",
      difficulty: "중급",
      location: "은평구",
      likes: 29,
      comments: 11,
      timeAgo: "5일 전",
    },
    {
      id: 13,
      title: "플랭크 30일 챌린지",
      author: "코어킹",
      difficulty: "중급",
      location: "관악구",
      likes: 33,
      comments: 15,
      timeAgo: "6일 전",
    },
    {
      id: 14,
      title: "운동화 선택 가이드",
      author: "기어전문가",
      difficulty: "초급",
      location: "동작구",
      likes: 21,
      comments: 8,
      timeAgo: "6일 전",
    },
    {
      id: 15,
      title: "체중 감량 성공 스토리",
      author: "변신성공러",
      difficulty: "중급",
      location: "중랑구",
      likes: 45,
      comments: 22,
      timeAgo: "1주 전",
    },
    {
      id: 16,
      title: "근육량 늘리기 프로그램",
      author: "벌크업전문가",
      difficulty: "고급",
      location: "강동구",
      likes: 37,
      comments: 13,
      timeAgo: "1주 전",
    },
    {
      id: 17,
      title: "요가와 HIIT 조합",
      author: "요가러버",
      difficulty: "중급",
      location: "서대문구",
      likes: 26,
      comments: 10,
      timeAgo: "1주 전",
    },
    {
      id: 18,
      title: "운동 일지 작성법",
      author: "기록매니아",
      difficulty: "초급",
      location: "영등포구",
      likes: 14,
      comments: 5,
      timeAgo: "1주 전",
    },
    {
      id: 19,
      title: "고강도 인터벌 훈련",
      author: "인터벌킹",
      difficulty: "고급",
      location: "금천구",
      likes: 41,
      comments: 19,
      timeAgo: "1주 전",
    },
    {
      id: 20,
      title: "운동 습관 만들기",
      author: "습관마에스트로",
      difficulty: "초급",
      location: "구로구",
      likes: 18,
      comments: 7,
      timeAgo: "1주 전",
    },
  ];

  return (
    <div className="space-y-16">
      <BackgroundPaths
        title="하이록스를 더 즐기는 방법"
        description="커뮤니티 활동을 공유하고 새로운 만남을 이어가세요."
      />

      {/* Community Posts Section */}
      <section className="container mx-auto max-w-7xl px-4">
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {communityPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        post.difficulty === "초급"
                          ? "secondary"
                          : post.difficulty === "중급"
                          ? "default"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {post.difficulty}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {post.location}
                    </div>
                  </div>
                  <CardTitle className="text-sm line-clamp-2 leading-tight">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <div className="h-24 bg-muted rounded-md flex items-center justify-center mb-3">
                    <Target className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <User className="h-3 w-3 mr-1" />
                    <span className="truncate">{post.author}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 space-y-2">
                  <div className="flex items-center justify-between w-full text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3 text-red-500" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3 text-blue-500" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                    <span className="text-muted-foreground">
                      {post.timeAgo}
                    </span>
                  </div>
                  <Link href={`/posts/${post.id}`} className="w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                    >
                      보기
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center pb-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className="pointer-events-none opacity-50"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </section>
    </div>
  );
}
