import { Filter, Search, Plus, MapPin, Clock, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PostsPage() {
  const posts = [
    {
      id: 1,
      title: "15분 하체 집중 HIIT - 스쿼트 변형 7가지",
      author: "트레이너김",
      difficulty: "중급",
      location: "강남구",
      likes: 24,
      comments: 8,
      timeAgo: "2시간 전",
      description: "하체 근력 강화를 위한 다양한 스쿼트 변형 운동을 포함한 15분 HIIT 프로그램입니다.",
      tags: ["하체", "스쿼트", "근력"],
    },
    {
      id: 2,
      title: "초보자를 위한 전신 운동 - 집에서도 OK",
      author: "피트니스러버",
      difficulty: "초급",
      location: "마포구",
      likes: 18,
      comments: 12,
      timeAgo: "5시간 전",
      description: "운동 초보자도 쉽게 따라할 수 있는 전신 운동 루틴입니다. 장비 없이 집에서도 가능합니다.",
      tags: ["초보자", "전신", "홈트"],
    },
    {
      id: 3,
      title: "코어 강화 20분 루틴 - 복근 만들기",
      author: "운동매니아",
      difficulty: "고급",
      location: "송파구",
      likes: 31,
      comments: 5,
      timeAgo: "1일 전",
      description: "강한 코어를 위한 고강도 20분 운동 프로그램입니다. 플랭크 변형 운동 포함.",
      tags: ["코어", "복근", "플랭크"],
    },
    {
      id: 4,
      title: "아침 10분 에너지 부스터 운동",
      author: "모닝러너",
      difficulty: "초급",
      location: "서초구",
      likes: 15,
      comments: 3,
      timeAgo: "1일 전",
      description: "하루를 활기차게 시작할 수 있는 간단한 아침 운동 루틴입니다.",
      tags: ["아침", "간단", "에너지"],
    },
    {
      id: 5,
      title: "상체 집중 덤벨 HIIT - 어깨와 팔",
      author: "헬스트레이너",
      difficulty: "중급",
      location: "강서구",
      likes: 22,
      comments: 7,
      timeAgo: "2일 전",
      description: "덤벨을 활용한 상체 집중 HIIT 프로그램으로 어깨와 팔 근육을 강화하세요.",
      tags: ["상체", "덤벨", "어깨"],
    },
    {
      id: 6,
      title: "카디오 폭발 30분 - 체지방 태우기",
      author: "카디오킹",
      difficulty: "고급",
      location: "종로구",
      likes: 35,
      comments: 14,
      timeAgo: "3일 전",
      description: "강렬한 유산소 운동으로 체지방을 효과적으로 태우는 30분 프로그램입니다.",
      tags: ["카디오", "체지방", "유산소"],
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">운동 프로그램</h1>
            <p className="text-muted-foreground">
              커뮤니티의 다양한 HIIT 운동 프로그램을 둘러보세요
            </p>
          </div>
          <Link href="/posts/create">
            <Button className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              프로그램 작성하기
            </Button>
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="운동 제목, 태그, 위치 검색..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="난이도" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="beginner">초급</SelectItem>
                <SelectItem value="intermediate">중급</SelectItem>
                <SelectItem value="advanced">고급</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="지역" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="gangnam">강남구</SelectItem>
                <SelectItem value="mapo">마포구</SelectItem>
                <SelectItem value="songpa">송파구</SelectItem>
                <SelectItem value="seocho">서초구</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge 
                  variant={
                    post.difficulty === "초급" ? "secondary" : 
                    post.difficulty === "중급" ? "default" : "destructive"
                  }
                >
                  {post.difficulty}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {post.location}
                </div>
              </div>
              <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Clock className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-sm">운동 영상</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>by {post.author}</span>
                <span>{post.timeAgo}</span>
              </div>
            </CardContent>
            
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
                <Link href={`/posts/${post.id}`}>
                  <Button variant="ghost" size="sm">
                    보기
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          더 많은 프로그램 보기
        </Button>
      </div>
    </div>
  );
}