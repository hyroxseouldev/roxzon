-- Drop existing policies
DROP POLICY IF EXISTS "Users can read their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- Create improved RLS policies with better null handling
CREATE POLICY "Users can read their own profile" ON public.users
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND auth.uid() = id
  );

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND auth.uid() = id
  );

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND auth.uid() = id
  );

-- Also allow users to delete their own profile
CREATE POLICY "Users can delete their own profile" ON public.users
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND auth.uid() = id
  );