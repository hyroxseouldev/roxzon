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