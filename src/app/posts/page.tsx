"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import ProtectedRoute from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, MapPin, Calendar, Plus } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  topic: string;
  difficulty: string;
  location: string;
  instagram_url: string;
  image_urls: string[];
  like_count: number;
  comment_count: number;
  created_at: string;
  user_id: string;
  users: {
    nickname: string;
    avatar_url: string;
  };
}

const TOPICS = [
  "전체",
  "초보자 가이드",
  "HIIT 운동",
  "근력 운동",
  "유산소 운동",
  "스트레칭",
  "영양 정보",
  "운동 도구",
  "홈트레이닝",
  "헬스장 운동"
];

const DIFFICULTY_COLORS = {
  "초급": "bg-green-500",
  "중급": "bg-yellow-500", 
  "고급": "bg-red-500"
};

export default function PostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("전체");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    loadPosts();
  }, [selectedTopic, currentPage]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("posts")
        .select(`
          *,
          users!inner(nickname, avatar_url)
        `)
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * postsPerPage, currentPage * postsPerPage - 1);

      if (selectedTopic !== "전체") {
        query = query.eq("topic", selectedTopic);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("게시글 로드 오류:", error);
        return;
      }

      setPosts(data || []);
      setTotalPages(Math.ceil((count || 0) / postsPerPage));
    } catch (error) {
      console.error("게시글 로드 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}시간 전`;
    } else {
      return `${Math.floor(diffInHours / 24)}일 전`;
    }
  };

  return (
    <ProtectedRoute requireProfile={true}>
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto max-w-7xl p-6">
          {/* 2:5:3 그리드 레이아웃 */}
          <div className="grid grid-cols-10 gap-6">
            {/* 좌측 토픽 메뉴 (2/10) */}
            <div className="col-span-2">
              <div className="sticky top-6">
                <h2 className="text-xl font-bold mb-4">토픽</h2>
                <div className="space-y-2">
                  {TOPICS.map((topic) => (
                    <Button
                      key={topic}
                      variant={selectedTopic === topic ? "default" : "ghost"}
                      className={`w-full justify-start text-left ${
                        selectedTopic === topic 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                      }`}
                      onClick={() => {
                        setSelectedTopic(topic);
                        setCurrentPage(1);
                      }}
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 중앙 게시글 목록 (5/10) */}
            <div className="col-span-5">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                  {selectedTopic === "전체" ? "모든 게시글" : selectedTopic}
                </h1>
                <Link href="/posts/create">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    새 게시글
                  </Button>
                </Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Card key={i} className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-8 text-center">
                    <p className="text-zinc-400 mb-4">아직 게시글이 없습니다.</p>
                    <Link href="/posts/create">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        첫 번째 게시글 작성하기
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id} className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={post.users.avatar_url} />
                              <AvatarFallback>{post.users.nickname.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-white">{post.users.nickname}</p>
                              <div className="flex items-center space-x-2 text-sm text-zinc-400">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(post.created_at)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {post.difficulty && (
                              <Badge className={`${DIFFICULTY_COLORS[post.difficulty as keyof typeof DIFFICULTY_COLORS]} text-white`}>
                                {post.difficulty}
                              </Badge>
                            )}
                            {post.topic && (
                              <Badge variant="outline" className="text-zinc-300 border-zinc-600">
                                {post.topic}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Link href={`/posts/${post.id}`}>
                          <div className="cursor-pointer">
                            <h3 className="text-lg font-semibold text-white mb-2 hover:text-blue-400 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-zinc-300 mb-3 line-clamp-3">
                              {post.content}
                            </p>
                            
                            {post.location && (
                              <div className="flex items-center text-sm text-zinc-400 mb-3">
                                <MapPin className="h-3 w-3 mr-1" />
                                {post.location}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-zinc-400">
                                <div className="flex items-center space-x-1">
                                  <Heart className="h-4 w-4" />
                                  <span>{post.like_count}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.comment_count}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                  >
                    이전
                  </Button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(i + 1)}
                      className={
                        currentPage === i + 1
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                      }
                    >
                      {i + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                  >
                    다음
                  </Button>
                </div>
              )}
            </div>

            {/* 우측 토픽 정보 (3/10) */}
            <div className="col-span-3">
              <div className="sticky top-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <h3 className="text-lg font-bold text-white">
                      {selectedTopic === "전체" ? "커뮤니티 정보" : selectedTopic}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    {selectedTopic === "전체" ? (
                      <div className="space-y-4">
                        <p className="text-zinc-300 text-sm">
                          HIIT 운동에 관한 모든 정보를 공유하는 커뮤니티입니다.
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">총 게시글</span>
                            <span className="text-white">{posts.length}개</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">활성 토픽</span>
                            <span className="text-white">{TOPICS.length - 1}개</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-zinc-300 text-sm">
                          {selectedTopic}에 관한 게시글들을 모아봤습니다.
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">이 토픽의 게시글</span>
                            <span className="text-white">{posts.length}개</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 인기 토픽 */}
                <Card className="bg-zinc-900 border-zinc-800 mt-4">
                  <CardHeader>
                    <h3 className="text-lg font-bold text-white">인기 토픽</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {TOPICS.slice(1, 6).map((topic) => (
                        <Button
                          key={topic}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left text-zinc-300 hover:text-white hover:bg-zinc-800"
                          onClick={() => {
                            setSelectedTopic(topic);
                            setCurrentPage(1);
                          }}
                        >
                          #{topic}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}