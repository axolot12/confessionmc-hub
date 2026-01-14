-- Fix RLS policies: Change from RESTRICTIVE to PERMISSIVE

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view site config" ON public.site_config;
DROP POLICY IF EXISTS "Admins can update site config" ON public.site_config;
DROP POLICY IF EXISTS "Admins can insert site config" ON public.site_config;

DROP POLICY IF EXISTS "Anyone can view ranks" ON public.ranks;
DROP POLICY IF EXISTS "Admins can manage ranks" ON public.ranks;

DROP POLICY IF EXISTS "Anyone can view keys" ON public.keys;
DROP POLICY IF EXISTS "Admins can manage keys" ON public.keys;

DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Recreate policies as PERMISSIVE (default)

-- Site Config policies
CREATE POLICY "Anyone can view site config" 
ON public.site_config FOR SELECT 
USING (true);

CREATE POLICY "Admins can update site config" 
ON public.site_config FOR UPDATE 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Admins can insert site config" 
ON public.site_config FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true));

-- Ranks policies
CREATE POLICY "Anyone can view ranks" 
ON public.ranks FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert ranks" 
ON public.ranks FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Admins can update ranks" 
ON public.ranks FOR UPDATE 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Admins can delete ranks" 
ON public.ranks FOR DELETE 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true));

-- Keys policies
CREATE POLICY "Anyone can view keys" 
ON public.keys FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert keys" 
ON public.keys FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Admins can update keys" 
ON public.keys FOR UPDATE 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Admins can delete keys" 
ON public.keys FOR DELETE 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true));

-- Profiles policies
CREATE POLICY "Anyone can view profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Enable realtime for ranks and keys
ALTER PUBLICATION supabase_realtime ADD TABLE public.ranks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.keys;