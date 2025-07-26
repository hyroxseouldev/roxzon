"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Target,
  MapPin,
  Heart,
  MessageCircle,
  User,
  Search,
  Filter,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function CommunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
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
  ];

  const filteredPosts = communityPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || post.difficulty === difficultyFilter;
    const matchesLocation = locationFilter === "all" || post.location.includes(locationFilter);
    
    return matchesSearch && matchesDifficulty && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            커뮤니티 게시글
          </h1>
          <p className="text-muted-foreground text-lg">
            하이록스 커뮤니티의 다양한 운동 정보와 경험을 공유해보세요
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="게시글 제목이나 작성자를 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="난이도" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="초급">초급</SelectItem>
              <SelectItem value="중급">중급</SelectItem>
              <SelectItem value="고급">고급</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="지역" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="강남구">강남구</SelectItem>
              <SelectItem value="마포구">마포구</SelectItem>
              <SelectItem value="송파구">송파구</SelectItem>
              <SelectItem value="서초구">서초구</SelectItem>
              <SelectItem value="용산구">용산구</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/communities/create">
            <Button className="w-full md:w-auto">
              게시글 작성
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            총 {filteredPosts.length}개의 게시글
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {filteredPosts.map((post) => (
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
                  <span className="text-muted-foreground">{post.timeAgo}</span>
                </div>
                <Link href={`/communities/${post.id}`} className="w-full">
                  <Button variant="ghost" size="sm" className="w-full text-xs">
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
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}