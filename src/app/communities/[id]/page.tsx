"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Target,
  MapPin,
  Heart,
  MessageCircle,
  User,
  Calendar,
  Share2,
  Instagram,
  ChevronLeft,
  ChevronRight,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function CommunityPostPage() {
  const params = useParams();
  const postId = params.id;
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(24);
  const [comment, setComment] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const post = {
    id: postId,
    title: "15분 하체 집중 HIIT",
    author: {
      name: "트레이너김",
      avatar: null,
    },
    difficulty: "중급",
    location: "강남구",
    instagramLink: "https://instagram.com/trainer_kim",
    likes: likeCount,
    comments: 8,
    timeAgo: "2시간 전",
    createdAt: "2025년 1월 26일",
    content: `안녕하세요! 오늘은 집에서도 쉽게 할 수 있는 15분 하체 집중 HIIT 운동을 소개해드리겠습니다.

이 운동은 스쿼트, 런지, 점프 스쿼트 등 하체 근력을 키우는 동시에 유산소 효과도 얻을 수 있는 프로그램입니다.

운동 구성:
1. 워밍업 (2분)
2. 스쿼트 30초 / 휴식 10초
3. 런지 30초 / 휴식 10초  
4. 점프 스쿼트 30초 / 휴식 10초
5. 버피 30초 / 휴식 10초
6. 플랭크 30초 / 휴식 10초

총 3세트 반복하시면 됩니다!

초보자분들은 점프 동작을 빼고 하셔도 충분히 효과적이에요. 
꾸준히 하시면 하체 라인이 확실히 달라지실 거예요! 💪

운동 후에는 충분한 스트레칭도 잊지 마세요~`,
    images: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300", 
      "/api/placeholder/400/300",
    ],
  };

  const comments = [
    {
      id: 1,
      author: "운동초보자",
      content: "와 정말 좋은 운동이네요! 오늘부터 바로 따라해보겠습니다!",
      timeAgo: "1시간 전",
      likes: 3,
    },
    {
      id: 2,
      author: "홈트러버",
      content: "점프 스쿼트가 생각보다 힘드네요 ㅠㅠ 그래도 효과는 확실한 것 같아요!",
      timeAgo: "30분 전",
      likes: 2,
    },
    {
      id: 3,
      author: "다이어터123",
      content: "이 운동 1주일째 하고 있는데 벌써 다리가 단단해진 느낌이에요! 감사합니다~",
      timeAgo: "15분 전",
      likes: 5,
    },
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? post.images.length - 1 : currentImageIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(
      currentImageIndex === post.images.length - 1 ? 0 : currentImageIndex + 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/communities">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로 돌아가기
            </Button>
          </Link>
        </div>

        {/* Post Content */}
        <Card className="mb-8">
          <CardHeader className="space-y-4">
            {/* Post Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
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
                  <MapPin className="h-4 w-4 mr-1" />
                  {post.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {post.createdAt}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  공유
                </Button>
                {post.instagramLink && (
                  <Link href={post.instagramLink} target="_blank">
                    <Button variant="outline" size="sm">
                      <Instagram className="h-4 w-4 mr-1" />
                      인스타
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground">
              {post.title}
            </h1>

            {/* Author */}
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">{post.timeAgo}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Image Gallery */}
            {post.images.length > 0 && (
              <div className="relative">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Target className="h-12 w-12 text-muted-foreground" />
                  </div>
                  
                  {post.images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10"
                        onClick={handlePrevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
                        onClick={handleNextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-3 py-1">
                        <span className="text-white text-sm">
                          {currentImageIndex + 1} / {post.images.length}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-line text-foreground leading-relaxed">
                {post.content}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className="flex items-center space-x-2"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isLiked ? "fill-current" : ""
                  }`}
                />
                <span>{likeCount}</span>
              </Button>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}개의 댓글</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle>댓글 ({comments.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comment Form */}
            <div className="space-y-3">
              <Textarea
                placeholder="댓글을 작성해보세요..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end">
                <Button size="sm">댓글 작성</Button>
              </div>
            </div>

            <Separator />

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {comment.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {comment.timeAgo}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{comment.content}</p>
                    <div className="flex items-center space-x-3">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Heart className="h-3 w-3 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        답글
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}