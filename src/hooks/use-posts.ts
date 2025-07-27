import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTopics,
  fetchPosts,
  togglePostLike,
  createPost,
  CreatePostData,
  fetchPostById,
  deletePost,
  fetchComments,
  createComment,
  CreateCommentData,
  updateComment,
  deleteComment,
} from "@/lib/api";

// 토픽 조회 hook
export const useTopics = () => {
  return useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
  });
};

// 게시글 조회 hook
export const usePosts = ({
  topicId,
  page = 1,
  pageSize = 10,
}: {
  topicId?: string | null;
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ["posts", topicId, page, pageSize],
    queryFn: () => fetchPosts({ topicId, page, pageSize }),
  });
};

// 좋아요 토글 hook
export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: togglePostLike,
    onSuccess: () => {
      // 게시글 목록과 단일 게시글 캐시 모두 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });
};

// 게시글 작성 hook
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // 게시글 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// 단일 게시글 조회 hook
export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// 게시글 삭제 hook
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, postId) => {
      // 해당 게시글 캐시 제거
      queryClient.removeQueries({ queryKey: ["post", postId] });
      // 게시글 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// 댓글 목록 조회 hook
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
  });
};

// 댓글 작성 hook
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      commentData,
    }: {
      postId: string;
      commentData: CreateCommentData;
    }) => createComment(postId, commentData),
    onSuccess: (_, { postId }) => {
      // 댓글 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      // 게시글의 댓글 수도 갱신
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// 댓글 수정 hook
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => updateComment(commentId, content),
    onSuccess: (comment) => {
      // 댓글 목록 갱신
      queryClient.invalidateQueries({
        queryKey: ["comments", comment.post_id],
      });
    },
  });
};

// 댓글 삭제 hook
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (_, commentId) => {
      // 모든 댓글 캐시 갱신 (어떤 포스트의 댓글인지 모르므로)
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
