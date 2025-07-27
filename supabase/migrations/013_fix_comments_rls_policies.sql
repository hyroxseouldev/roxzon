-- Fix comments RLS policies to allow proper update operations

-- Drop existing comment policies
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

-- Recreate update policy with both USING and WITH CHECK
CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Recreate delete policy (keep as is, but for clarity)
CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add policy for soft delete updates (when is_deleted is set to true)
CREATE POLICY "Users can soft delete their own comments" ON public.comments
  FOR UPDATE 
  USING (auth.uid() = user_id AND is_deleted = false)
  WITH CHECK (auth.uid() = user_id); 