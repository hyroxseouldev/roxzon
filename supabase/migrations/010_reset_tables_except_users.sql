-- Reset all tables except users table
-- This migration drops all tables except the users table

-- Drop triggers first
DROP TRIGGER IF EXISTS likes_insert_trigger ON public.likes;
DROP TRIGGER IF EXISTS likes_delete_trigger ON public.likes;
DROP TRIGGER IF EXISTS comments_insert_trigger ON public.comments;
DROP TRIGGER IF EXISTS comments_delete_trigger ON public.comments;
DROP TRIGGER IF EXISTS comment_likes_insert_trigger ON public.comment_likes;
DROP TRIGGER IF EXISTS comment_likes_delete_trigger ON public.comment_likes;
DROP TRIGGER IF EXISTS communities_updated_at ON public.communities;
DROP TRIGGER IF EXISTS comments_updated_at ON public.comments;
DROP TRIGGER IF EXISTS posts_updated_at ON public.posts;

-- Drop functions
DROP FUNCTION IF EXISTS public.update_communities_likes_count();
DROP FUNCTION IF EXISTS public.update_communities_comments_count();
DROP FUNCTION IF EXISTS public.update_comments_likes_count();

-- Drop tables (in order to avoid foreign key constraint issues)
DROP TABLE IF EXISTS public.comment_likes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.communities CASCADE;

-- Drop storage buckets if they exist
DELETE FROM storage.buckets WHERE id = 'post-images';

-- Note: users table is preserved