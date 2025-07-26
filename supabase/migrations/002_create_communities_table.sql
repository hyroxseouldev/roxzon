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