-- Create new schema for Roxzon platform
-- Topics, Posts, Comments, Likes tables with proper relationships

-- Create updated_at function first
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Create Topics table (categories/subjects for posts)
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6366f1', -- hex color for UI
  icon VARCHAR(50), -- icon name for UI
  post_count INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create topics updated_at trigger
CREATE TRIGGER topics_updated_at
  BEFORE UPDATE ON public.topics
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. Create Posts table (main content)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT, -- brief summary for listings
  difficulty VARCHAR(20) CHECK (difficulty IN ('초급', '중급', '고급')),
  duration_minutes INTEGER, -- workout duration in minutes
  location VARCHAR(200),
  instagram_link VARCHAR(100),
  youtube_link VARCHAR(200),
  images JSONB DEFAULT '[]'::jsonb, -- array of image URLs
  tags TEXT[], -- array of tags
  views_count INTEGER DEFAULT 0 NOT NULL,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  comments_count INTEGER DEFAULT 0 NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  is_published BOOLEAN DEFAULT true NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create posts updated_at trigger
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3. Create Comments table (nested comments support)
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (length(content) >= 1 AND length(content) <= 2000),
  likes_count INTEGER DEFAULT 0 NOT NULL,
  reply_count INTEGER DEFAULT 0 NOT NULL,
  is_edited BOOLEAN DEFAULT false NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create comments updated_at trigger
CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Create Likes table (for posts)
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure a user can only like a post once
  UNIQUE(user_id, post_id)
);

-- 5. Create Comment Likes table (for comment likes)
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure a user can only like a comment once
  UNIQUE(user_id, comment_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_topics_name ON public.topics(name);
CREATE INDEX IF NOT EXISTS idx_topics_active ON public.topics(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_topic_id ON public.posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(is_published, published_at DESC) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_posts_featured ON public.posts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_posts_difficulty ON public.posts(difficulty);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_not_deleted ON public.comments(post_id, created_at) WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON public.likes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON public.comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Topics
CREATE POLICY "Topics are viewable by everyone" ON public.topics
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only authenticated users can suggest topics" ON public.topics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for Posts
CREATE POLICY "Published posts are viewable by everyone" ON public.posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can create their own posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Comments
CREATE POLICY "Comments on published posts are viewable by everyone" ON public.comments
  FOR SELECT USING (
    is_deleted = false AND 
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE id = post_id AND is_published = true
    )
  );

CREATE POLICY "Users can create comments on published posts" ON public.comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE id = post_id AND is_published = true
    )
  );

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Likes
CREATE POLICY "Likes are viewable by everyone" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like posts" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Comment Likes
CREATE POLICY "Comment likes are viewable by everyone" ON public.comment_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like comments" ON public.comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own comment likes" ON public.comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Functions to update counters
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts
    SET comments_count = comments_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.comments
    SET likes_count = likes_count + 1
    WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.comments
    SET likes_count = likes_count - 1
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_comment_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_id IS NOT NULL THEN
    UPDATE public.comments
    SET reply_count = reply_count + 1
    WHERE id = NEW.parent_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_id IS NOT NULL THEN
    UPDATE public.comments
    SET reply_count = reply_count - 1
    WHERE id = OLD.parent_id;
    RETURN OLD;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_topic_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.topic_id IS NOT NULL AND NEW.is_published = true THEN
    UPDATE public.topics
    SET post_count = post_count + 1
    WHERE id = NEW.topic_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.topic_id IS NOT NULL AND OLD.is_published = true THEN
    UPDATE public.topics
    SET post_count = post_count - 1
    WHERE id = OLD.topic_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle topic change or publish status change
    IF OLD.topic_id IS DISTINCT FROM NEW.topic_id OR OLD.is_published IS DISTINCT FROM NEW.is_published THEN
      -- Decrease count from old topic
      IF OLD.topic_id IS NOT NULL AND OLD.is_published = true THEN
        UPDATE public.topics
        SET post_count = post_count - 1
        WHERE id = OLD.topic_id;
      END IF;
      -- Increase count for new topic
      IF NEW.topic_id IS NOT NULL AND NEW.is_published = true THEN
        UPDATE public.topics
        SET post_count = post_count + 1
        WHERE id = NEW.topic_id;
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to maintain counter consistency
CREATE TRIGGER likes_count_trigger
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_likes_count();

CREATE TRIGGER comments_count_trigger
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_comments_count();

CREATE TRIGGER comment_likes_count_trigger
  AFTER INSERT OR DELETE ON public.comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_comment_likes_count();

CREATE TRIGGER comment_reply_count_trigger
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_comment_reply_count();

CREATE TRIGGER topic_post_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_topic_post_count();

-- Insert default topics
INSERT INTO public.topics (name, description, color, icon) VALUES
('HIIT', 'High-Intensity Interval Training 운동', '#ef4444', 'Zap'),
('근력운동', '웨이트 트레이닝 및 근력 강화', '#3b82f6', 'Dumbbell'),
('유산소', '카디오 및 지구력 운동', '#10b981', 'Heart'),
('요가', '유연성 및 마음챙김 운동', '#8b5cf6', 'Flower'),
('다이어트', '체중 감량 관련 운동 및 팁', '#f59e0b', 'Scale'),
('홈트레이닝', '집에서 하는 운동', '#06b6d4', 'Home'),
('초보자', '운동 입문자를 위한 가이드', '#84cc16', 'GraduationCap'),
('영양/식단', '운동과 관련된 영양 정보', '#f97316', 'Apple')
ON CONFLICT (name) DO NOTHING;