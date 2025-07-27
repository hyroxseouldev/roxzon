'use client';

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Instagram, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";
import { CommentSection } from "@/components/comment-section";
import { LikeButton } from "@/components/like-button";

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulating API call with mock data
    setTimeout(() => {
      const mockPost = {
        id: params.id,
        title: "고강도 HIIT 운동 루틴 공유",
        content: "오늘 시도해본 HIIT 운동 루틴을 공유합니다! 30초 운동, 15초 휴식으로 총 20분간 진행했는데 정말 효과적이었어요. 버피, 스쿼트 점프, 마운틴 클라이머, 플랭크 잭을 반복했습니다.",
        difficulty: "고급",
        location: "서울시 강남구",
        instagram_link: "@hiit_master_kim",
        images: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"
        ],
        likes_count: 42,
        comments_count: 8,
        created_at: "2024-07-27T10:30:00Z",
        user: {
          id: "user1",
          nickname: "HIIT마스터",
          avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40"
        },
        isLiked: false
      };

      const mockComments = [
        {
          id: "c1",
          content: "정말 좋은 루틴이네요! 저도 따라해봐야겠어요.",
          user: {
            id: "user2",
            nickname: "운동좋아",
            avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b169?w=40"
          },
          likes_count: 5,
          created_at: "2024-07-27T11:00:00Z",
          parent_id: null,
          isLiked: false,
          replies: [
            {
              id: "c2",
              content: "네! 처음에는 조금 힘들 수 있지만 금세 적응될 거예요.",
              user: {
                id: "user1",
                nickname: "HIIT마스터",
                avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40"
              },
              likes_count: 2,
              created_at: "2024-07-27T11:15:00Z",
              parent_id: "c1",
              isLiked: true
            }
          ]
        },
        {
          id: "c3",
          content: "버피는 정말 힘들지만 효과가 좋죠! 몇 세트나 하시나요?",
          user: {
            id: "user3",
            nickname: "피트니스걸",
            avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40"
          },
          likes_count: 3,
          created_at: "2024-07-27T12:00:00Z",
          parent_id: null,
          isLiked: false
        }
      ];

      setPost(mockPost);
      setComments(mockComments);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const handleToggleLike = async (postId: string, isLiked: boolean) => {
    // Mock API call
    console.log(`Toggle like for post ${postId}:`, isLiked);
    setPost((prev: any) => ({
      ...prev,
      isLiked,
      likes_count: isLiked ? prev.likes_count + 1 : prev.likes_count - 1
    }));
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    const newComment = {
      id: `c${Date.now()}`,
      content,
      user: {
        id: "current_user",
        nickname: "나",
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40"
      },
      likes_count: 0,
      created_at: new Date().toISOString(),
      parent_id: parentId || null,
      isLiked: false
    };

    if (parentId) {
      setComments(prev => prev.map(comment => 
        comment.id === parentId 
          ? { ...comment, replies: [...(comment.replies || []), newComment] }
          : comment
      ));
    } else {
      setComments(prev => [newComment, ...prev]);
    }
  };

  const handleToggleCommentLike = (commentId: string) => {
    console.log(`Toggle like for comment ${commentId}`);
  };

  const handleDeleteComment = (commentId: string) => {
    console.log(`Delete comment ${commentId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '초급': return 'bg-green-500';
      case '중급': return 'bg-yellow-500';
      case '고급': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireProfile={true}>
        <div className="min-h-screen bg-black text-white p-8">
          <div className="container mx-auto max-w-4xl">
            <div className="animate-pulse space-y-8">
              <div className="h-10 bg-zinc-800 rounded"></div>
              <div className="h-32 bg-zinc-800 rounded"></div>
              <div className="space-y-4">
                <div className="h-20 bg-zinc-800 rounded"></div>
                <div className="h-20 bg-zinc-800 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireProfile={true}>
      <div className="min-h-screen bg-black text-white p-4 md:p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Link href="/posts">
              <Button variant="ghost" className="text-zinc-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                게시글 목록으로 돌아가기
              </Button>
            </Link>
          </div>
          
          {post && (
            <div className="space-y-8">
              {/* Post Header */}
              <Card className="bg-zinc-900 border-zinc-800 p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.user.avatar_url} />
                    <AvatarFallback>
                      {post.user.nickname.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{post.user.nickname}</h3>
                        <div className="flex items-center space-x-4 text-sm text-zinc-400 mt-1">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>2시간 전</span>
                          </div>
                          {post.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{post.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Badge 
                        className={`${getDifficultyColor(post.difficulty)} text-white`}
                      >
                        {post.difficulty}
                      </Badge>
                    </div>
                    
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                    <p className="text-zinc-300 leading-relaxed">{post.content}</p>
                    
                    {post.instagram_link && (
                      <div className="flex items-center space-x-2 text-purple-400">
                        <Instagram className="h-4 w-4" />
                        <span className="text-sm">{post.instagram_link}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.images.map((image: string, index: number) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`Post image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <Card className="bg-zinc-900 border-zinc-800 p-6">
                <div className="flex items-center justify-between">
                  <LikeButton
                    postId={post.id}
                    initialLiked={post.isLiked}
                    initialCount={post.likes_count}
                    onToggleLike={handleToggleLike}
                    size="lg"
                  />
                  
                  <div className="text-sm text-zinc-400">
                    댓글 {comments.length}개
                  </div>
                </div>
              </Card>

              {/* Comments Section */}
              <Card className="bg-zinc-900 border-zinc-800 p-6">
                <CommentSection
                  postId={post.id}
                  comments={comments}
                  onAddComment={handleAddComment}
                  onToggleLike={handleToggleCommentLike}
                  onDeleteComment={handleDeleteComment}
                />
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}