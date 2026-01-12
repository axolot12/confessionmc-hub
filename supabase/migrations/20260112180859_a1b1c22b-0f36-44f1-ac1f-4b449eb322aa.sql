-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  is_premium_minecraft BOOLEAN NOT NULL DEFAULT false,
  minecraft_uuid TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create site_config table for admin customization
CREATE TABLE public.site_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_name TEXT NOT NULL DEFAULT 'ConfessionMc',
  server_ip TEXT NOT NULL DEFAULT 'play.confessionmc.fun',
  server_port INTEGER NOT NULL DEFAULT 25594,
  discord_url TEXT NOT NULL DEFAULT 'https://discord.gg/nphym8nWXU',
  logo_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on site_config
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Anyone can read config
CREATE POLICY "Anyone can view site config" ON public.site_config FOR SELECT USING (true);
-- Only admins can update (we'll check in app logic)
CREATE POLICY "Admins can update site config" ON public.site_config FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can insert site config" ON public.site_config FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);

-- Create ranks table
CREATE TABLE public.ranks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  features TEXT[] NOT NULL DEFAULT '{}',
  color TEXT NOT NULL DEFAULT '#00D9FF',
  is_free BOOLEAN NOT NULL DEFAULT false,
  how_to_get TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ranks
ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;

-- Anyone can view ranks
CREATE POLICY "Anyone can view ranks" ON public.ranks FOR SELECT USING (true);
CREATE POLICY "Admins can manage ranks" ON public.ranks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);

-- Create keys table
CREATE TABLE public.keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#A855F7',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on keys
ALTER TABLE public.keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view keys" ON public.keys FOR SELECT USING (true);
CREATE POLICY "Admins can manage keys" ON public.keys FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);

-- Insert default site config
INSERT INTO public.site_config (server_name, server_ip, server_port, discord_url) 
VALUES ('ConfessionMc', 'play.confessionmc.fun', 25594, 'https://discord.gg/nphym8nWXU');

-- Insert sample ranks
INSERT INTO public.ranks (name, description, price, features, color, is_free, how_to_get, display_order) VALUES
('VIP', 'Basic VIP rank with cool perks', 4.99, ARRAY['Access to /fly', 'Custom chat color', '2x XP boost'], '#00D9FF', false, NULL, 1),
('VIP+', 'Enhanced VIP with more features', 9.99, ARRAY['All VIP perks', 'Pet companion', 'Priority queue'], '#00FFB3', false, NULL, 2),
('MVP', 'Most Valuable Player rank', 19.99, ARRAY['All VIP+ perks', 'Monthly crate key', 'Custom nick'], '#FFD700', false, NULL, 3),
('MVP+', 'Premium MVP experience', 29.99, ARRAY['All MVP perks', 'Exclusive gadgets', 'Private island'], '#FF6B6B', false, NULL, 4),
('LEGEND', 'Ultimate legendary status', 49.99, ARRAY['All MVP+ perks', 'Custom cape', 'Legend tag', 'Unlimited homes'], '#A855F7', false, NULL, 5),
('Starter', 'Free starter rank for new players', 0, ARRAY['Welcome kit', 'Basic commands', '1 home'], '#4ADE80', true, 'Join the server for the first time to receive this rank automatically!', 1),
('Voter', 'Reward for dedicated voters', 0, ARRAY['Vote perks', 'Monthly rewards', 'Voter tag'], '#38BDF8', true, 'Vote for our server daily on voting sites. After 30 votes, claim this rank!', 2);

-- Insert sample keys
INSERT INTO public.keys (name, description, price, color, display_order) VALUES
('Common Key', 'Basic crate key with common rewards', 1.99, '#9CA3AF', 1),
('Rare Key', 'Rare crate key with better loot', 4.99, '#3B82F6', 2),
('Epic Key', 'Epic crate key with amazing rewards', 9.99, '#A855F7', 3),
('Legendary Key', 'Legendary crate key with best items', 19.99, '#F59E0B', 4),
('Mythic Key', 'Ultra rare mythic crate key', 29.99, '#EC4899', 5);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON public.site_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ranks_updated_at BEFORE UPDATE ON public.ranks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_keys_updated_at BEFORE UPDATE ON public.keys FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();