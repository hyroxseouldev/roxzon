import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Users,
  Trophy,
  Target,
  Clock,
  MapPin,
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

export default function Home() {
  const featuredPosts = [
    {
      id: 1,
      title: "15분 하체 집중 HIIT",
      author: "트레이너김",
      difficulty: "중급",
      location: "강남구",
      likes: 24,
      timeAgo: "2시간 전",
      thumbnail: null,
    },
    {
      id: 2,
      title: "초보자를 위한 전신 운동",
      author: "피트니스러버",
      difficulty: "초급",
      location: "마포구",
      likes: 18,
      timeAgo: "5시간 전",
      thumbnail: null,
    },
    {
      id: 3,
      title: "코어 강화 20분 루틴",
      author: "운동매니아",
      difficulty: "고급",
      location: "송파구",
      likes: 31,
      timeAgo: "1일 전",
      thumbnail: null,
    },
  ];

  const difficultyPrograms = [
    {
      level: "초급",
      title: "HIIT 입문자 프로그램",
      description: "운동을 처음 시작하는 분들을 위한 기본 HIIT 루틴",
      duration: "15-20분",
      exercises: "5-7개",
      color: "bg-green-500",
    },
    {
      level: "중급",
      title: "체력 향상 프로그램",
      description: "기본기가 있는 분들을 위한 강도 높은 운동",
      duration: "20-30분",
      exercises: "8-12개",
      color: "bg-orange-500",
    },
    {
      level: "고급",
      title: "전문가 도전 프로그램",
      description: "최고 강도의 운동으로 한계를 뛰어넘어보세요",
      duration: "30-45분",
      exercises: "12-15개",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-16">
      <BackgroundPaths
        title="하이록스를 더 즐기는 방법"
        description="크루 활동을 공유하고 새로운 만남을 이어가세요."
      />

      {/* Latest Posts Section */}
      <section className="container mx-auto max-w-7xl px-4">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              최신 운동 프로그램
            </h2>
            <p className="text-muted-foreground">
              커뮤니티에서 가장 인기 있는 최신 HIIT 프로그램을 확인해보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        post.difficulty === "초급"
                          ? "secondary"
                          : post.difficulty === "중급"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {post.difficulty}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {post.location}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                      <Target className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        by {post.author}
                      </span>
                      <span className="text-muted-foreground">
                        {post.timeAgo}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <span>❤️ {post.likes}</span>
                    </div>
                    <Link href={`/posts/${post.id}`}>
                      <Button variant="ghost" size="sm">
                        보기
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/posts">
              <Button variant="outline" size="lg">
                모든 게시글 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Difficulty Programs Section */}
      <section className="bg-muted/20 border-y border-border/40">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                난이도별 프로그램
              </h2>
              <p className="text-muted-foreground">
                당신의 레벨에 맞는 HIIT 프로그램을 찾아보세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {difficultyPrograms.map((program) => (
                <Card
                  key={program.level}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full ${program.color}`}
                      />
                      <Badge variant="outline">{program.level}</Badge>
                    </div>
                    <CardTitle>{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {program.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>운동 시간: {program.duration}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>운동 개수: {program.exercises}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">프로그램 시작하기</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
