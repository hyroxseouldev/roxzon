-- Combined Migration for Roxzon Database
-- Execute this in Supabase SQL Editor

-- Create Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL CHECK (length(nickname) <= 20),
  bio TEXT CHECK (length(bio) <= 200),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_nickname_idx ON public.users(nickname);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON public.users(created_at);

-- Create Communities table (게시글 테이블)
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (length(title) >= 1 AND length(title) <= 200),
  content TEXT NOT NULL CHECK (length(content) >= 1),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('초급', '중급', '고급')),
  location TEXT NOT NULL,
  instagram_link TEXT,
  images TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0 NOT NULL,
  comments_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create updated_at trigger for communities
CREATE TRIGGER communities_updated_at
  BEFORE UPDATE ON public.communities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read communities" ON public.communities
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own communities" ON public.communities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own communities" ON public.communities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own communities" ON public.communities
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS communities_user_id_idx ON public.communities(user_id);
CREATE INDEX IF NOT EXISTS communities_difficulty_idx ON public.communities(difficulty);
CREATE INDEX IF NOT EXISTS communities_location_idx ON public.communities(location);
CREATE INDEX IF NOT EXISTS communities_created_at_idx ON public.communities(created_at DESC);
CREATE INDEX IF NOT EXISTS communities_likes_count_idx ON public.communities(likes_count DESC);

-- Create function to update likes_count
CREATE OR REPLACE FUNCTION public.update_communities_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities
    SET likes_count = likes_count + 1
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities
    SET likes_count = likes_count - 1
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to update comments_count
CREATE OR REPLACE FUNCTION public.update_communities_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities
    SET comments_count = comments_count + 1
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities
    SET comments_count = comments_count - 1
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create Likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure a user can only like a community once
  UNIQUE(user_id, community_id)
);

-- Enable Row Level Security
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read likes" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own likes" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS likes_community_id_idx ON public.likes(community_id);
CREATE INDEX IF NOT EXISTS likes_created_at_idx ON public.likes(created_at DESC);

-- Create triggers to update communities likes_count
CREATE TRIGGER likes_insert_trigger
  AFTER INSERT ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_communities_likes_count();

CREATE TRIGGER likes_delete_trigger
  AFTER DELETE ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_communities_likes_count();

-- Create Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (length(content) >= 1 AND length(content) <= 1000),
  likes_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create updated_at trigger for comments
CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read comments" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS comments_community_id_idx ON public.comments(community_id);
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments(created_at DESC);

-- Create triggers to update communities comments_count
CREATE TRIGGER comments_insert_trigger
  AFTER INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_communities_comments_count();

CREATE TRIGGER comments_delete_trigger
  AFTER DELETE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_communities_comments_count();

-- Create comment_likes table for comment likes
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure a user can only like a comment once
  UNIQUE(user_id, comment_id)
);

-- Enable Row Level Security for comment_likes
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for comment_likes
CREATE POLICY "Anyone can read comment likes" ON public.comment_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own comment likes" ON public.comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comment likes" ON public.comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for comment_likes
CREATE INDEX IF NOT EXISTS comment_likes_user_id_idx ON public.comment_likes(user_id);
CREATE INDEX IF NOT EXISTS comment_likes_comment_id_idx ON public.comment_likes(comment_id);

-- Create function to update comments likes_count
CREATE OR REPLACE FUNCTION public.update_comments_likes_count()
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

-- Create triggers to update comments likes_count
CREATE TRIGGER comment_likes_insert_trigger
  AFTER INSERT ON public.comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_comments_likes_count();

CREATE TRIGGER comment_likes_delete_trigger
  AFTER DELETE ON public.comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_comments_likes_count();