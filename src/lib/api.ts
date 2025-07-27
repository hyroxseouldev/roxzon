import { supabase } from "./supabase";

export interface Post {
  id: string;
  title: string;
  content: string;
  topic_id: string | null;
  difficulty?: string | null;
  location?: string | null;
  instagram_link?: string | null;
  images?: string[] | null;
  likes_count: number;
  comments_count: number;
  views_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  isLiked?: boolean; // 현재 사용자의 좋아요 상태
  users?: {
    nickname: string;
    avatar_url?: string | null;
  } | null;
  topics?: {
    name: string;
    description?: string | null;
    color: string;
    icon?: string | null;
  } | null;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  is_active: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  likes_count: number;
  reply_count: number;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  users?: {
    nickname: string;
    avatar_url?: string | null;
  } | null;
  replies?: Comment[];
}

export interface CreateCommentData {
  content: string;
  parent_id?: string;
}

export interface PostsResponse {
  posts: Post[];
  totalCount: number;
}

// 토픽 조회
export const fetchTopics = async (): Promise<Topic[]> => {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`토픽을 불러오는데 실패했습니다: ${error.message}`);
  }

  return data || [];
};

// 게시글 조회
export const fetchPosts = async ({
  topicId,
  page = 1,
  pageSize = 10,
}: {
  topicId?: string | null;
  page?: number;
  pageSize?: number;
}): Promise<PostsResponse> => {
  // 현재 인증된 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("posts")
    .select(
      `
      *,
      users(nickname, avatar_url),
      topics(name, description, color, icon)
    `,
      { count: "exact" }
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (topicId) {
    query = query.eq("topic_id", topicId);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`게시글을 불러오는데 실패했습니다: ${error.message}`);
  }

  // 각 포스트에 좋아요 수, 댓글 수, 좋아요 상태 추가
  let postsWithCounts = data || [];

  if (data && data.length > 0) {
    const postIds = data.map((post) => post.id);

    // 각 포스트의 좋아요 수 조회
    const likesCountPromises = postIds.map(async (postId) => {
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);
      return { postId, count: count || 0 };
    });

    // 각 포스트의 댓글 수 조회
    const commentsCountPromises = postIds.map(async (postId) => {
      const { count } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId)
        .eq("is_deleted", false);
      return { postId, count: count || 0 };
    });

    // 현재 사용자가 좋아요한 포스트들 조회
    let userLikes: { post_id: string }[] = [];
    if (user) {
      const { data: likesData } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", postIds);
      userLikes = likesData || [];
    }

    const [likesCounts, commentsCounts] = await Promise.all([
      Promise.all(likesCountPromises),
      Promise.all(commentsCountPromises),
    ]);

    const likesCountMap = new Map(likesCounts.map(item => [item.postId, item.count]));
    const commentsCountMap = new Map(commentsCounts.map(item => [item.postId, item.count]));
    const likedPostIds = new Set(userLikes.map((like) => like.post_id));

    postsWithCounts = data.map((post) => ({
      ...post,
      likes_count: likesCountMap.get(post.id) || 0,
      comments_count: commentsCountMap.get(post.id) || 0,
      isLiked: likedPostIds.has(post.id),
    }));
  }

  return {
    posts: postsWithCounts,
    totalCount: count || 0,
  };
};

// 포스트 좋아요 토글
export const togglePostLike = async (postId: string) => {
  // 현재 인증된 사용자 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("로그인이 필요합니다.");
  }

  // 우선 현재 좋아요 상태 확인
  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id) // 현재 사용자의 좋아요만 확인
    .single();

  if (existingLike) {
    // 좋아요 제거
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id); // 현재 사용자의 좋아요만 삭제

    if (error) throw error;
    return false; // unliked
  } else {
    // 좋아요 추가
    const { error } = await supabase.from("likes").insert({
      post_id: postId,
      user_id: user.id, // 현재 사용자 ID 추가
    });

    if (error) throw error;
    return true; // liked
  }
};

// 게시글 작성 인터페이스
export interface CreatePostData {
  title: string;
  content: string;
  topic_id: string;
  images?: File[];
}

// 이미지 업로드 (병렬 처리로 최적화)
export const uploadImages = async (images: File[]): Promise<string[]> => {
  if (!images || images.length === 0) return [];

  try {
    // 모든 이미지를 병렬로 업로드
    const uploadPromises = images.map(async (image, index) => {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}-${index}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `post-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, image);

      if (uploadError) {
        throw new Error(
          `이미지 업로드 실패 (${image.name}): ${uploadError.message}`
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("post-images").getPublicUrl(filePath);

      return publicUrl;
    });

    // 모든 업로드 완료를 기다림
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  } catch (error) {
    // 실패한 이미지가 있으면 전체 실패로 처리
    throw new Error(
      error instanceof Error
        ? error.message
        : "이미지 업로드 중 오류가 발생했습니다."
    );
  }
};

// 게시글 작성
export const createPost = async (postData: CreatePostData): Promise<Post> => {
  // 현재 인증된 사용자 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("로그인이 필요합니다.");
  }

  let imageUrls: string[] = [];

  // 이미지가 있으면 업로드
  if (postData.images && postData.images.length > 0) {
    imageUrls = await uploadImages(postData.images);
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id, // 현재 인증된 사용자 ID 추가
      title: postData.title,
      content: postData.content,
      topic_id: postData.topic_id,
      images: imageUrls,
      is_published: true,
    })
    .select(
      `
      *,
      users(nickname, avatar_url),
      topics(name, description, color, icon)
    `
    )
    .single();

  if (error) {
    throw new Error(`게시글 작성에 실패했습니다: ${error.message}`);
  }

  return data;
};

// 단일 게시글 조회
export const fetchPostById = async (postId: string): Promise<Post> => {
  // 현재 사용자 정보 가져오기 (좋아요 상태 확인용)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      users(nickname, avatar_url),
      topics(name, description, color, icon)
    `
    )
    .eq("id", postId)
    .eq("is_published", true)
    .single();

  if (error) {
    throw new Error(`게시글을 찾을 수 없습니다: ${error.message}`);
  }

  // 좋아요 개수 조회
  const { count: likesCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  // 댓글 개수 조회
  const { count: commentsCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("is_deleted", false);

  // 현재 사용자의 좋아요 상태 조회
  let isLiked = false;
  if (user) {
    const { data: likeData } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .single();
    
    isLiked = !!likeData;
  }

  return {
    ...data,
    likes_count: likesCount || 0,
    comments_count: commentsCount || 0,
    isLiked: isLiked,
  };
};

// 게시글 삭제
export const deletePost = async (postId: string): Promise<void> => {
  // 현재 인증된 사용자 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("로그인이 필요합니다.");
  }

  // 게시글과 이미지 정보 가져오기
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("user_id, images")
    .eq("id", postId)
    .single();

  if (fetchError) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }

  if (post.user_id !== user.id) {
    throw new Error("본인이 작성한 게시글만 삭제할 수 있습니다.");
  }

  // 먼저 관련 이미지들을 스토리지에서 삭제
  if (post.images && Array.isArray(post.images) && post.images.length > 0) {
    try {
      const filePaths = post.images.map((imageUrl: string) => {
        // URL에서 파일 경로 추출
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split("/");
        return `post-images/${pathParts[pathParts.length - 1]}`;
      });

      const { error: storageError } = await supabase.storage
        .from("post-images")
        .remove(filePaths);

      if (storageError) {
        console.error("이미지 삭제 실패:", storageError);
        // 이미지 삭제 실패해도 게시글은 삭제 진행
      }
    } catch (error) {
      console.error("이미지 삭제 중 오류:", error);
      // 이미지 삭제 실패해도 게시글은 삭제 진행
    }
  }

  // 게시글 삭제
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id); // 추가 보안을 위한 user_id 확인

  if (error) {
    throw new Error(`게시글 삭제에 실패했습니다: ${error.message}`);
  }
};

// 댓글 목록 조회
export const fetchComments = async (postId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      users(nickname, avatar_url)
    `
    )
    .eq("post_id", postId)
    .eq("is_deleted", false)
    .is("parent_id", null) // 최상위 댓글만 조회
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`댓글을 불러오는데 실패했습니다: ${error.message}`);
  }

  // 각 댓글의 대댓글들 조회
  const commentsWithReplies = await Promise.all(
    (data || []).map(async (comment) => {
      const { data: replies, error: repliesError } = await supabase
        .from("comments")
        .select(
          `
          *,
          users(nickname, avatar_url)
        `
        )
        .eq("parent_id", comment.id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: true });

      if (repliesError) {
        console.error("대댓글 조회 오류:", repliesError);
      }

      return {
        ...comment,
        replies: replies || [],
      };
    })
  );

  return commentsWithReplies;
};

// 댓글 작성
export const createComment = async (
  postId: string,
  commentData: CreateCommentData
): Promise<Comment> => {
  // 현재 인증된 사용자 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("로그인이 필요합니다.");
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: user.id,
      content: commentData.content,
      parent_id: commentData.parent_id || null,
    })
    .select(
      `
      *,
      users(nickname, avatar_url)
    `
    )
    .single();

  if (error) {
    throw new Error(`댓글 작성에 실패했습니다: ${error.message}`);
  }

  return data;
};

// 댓글 수정
export const updateComment = async (
  commentId: string,
  content: string
): Promise<Comment> => {
  // 현재 인증된 사용자 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("로그인이 필요합니다.");
  }

  const { data, error } = await supabase
    .from("comments")
    .update({
      content,
      is_edited: true,
    })
    .eq("id", commentId)
    .eq("user_id", user.id) // 본인 댓글만 수정 가능
    .select(
      `
      *,
      users(nickname, avatar_url)
    `
    )
    .single();

  if (error) {
    throw new Error(`댓글 수정에 실패했습니다: ${error.message}`);
  }

  return data;
};

// 댓글 삭제
export const deleteComment = async (commentId: string): Promise<void> => {
  // 현재 인증된 사용자 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("로그인이 필요합니다.");
  }

  // 댓글 소프트 삭제 (클라이언트에서 본인 확인)
  const { error } = await supabase
    .from("comments")
    .update({
      is_deleted: true,
      content: "삭제된 댓글입니다.",
    })
    .eq("id", commentId)
    .eq("user_id", user.id); // 본인 댓글만 삭제 가능

  if (error) {
    throw new Error(`댓글 삭제에 실패했습니다: ${error.message}`);
  }
};
