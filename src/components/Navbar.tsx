import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings } from 'lucide-react';
import logo from '@/assets/logo.png';
import AuthDialog from './AuthDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Profile {
  username: string;
  is_admin: boolean;
  is_premium_minecraft: boolean;
}

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('username, is_admin, is_premium_minecraft')
          .eq('user_id', session.user.id)
          .maybeSingle();
        setProfile(data);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('username, is_admin, is_premium_minecraft')
          .eq('user_id', session.user.id)
          .maybeSingle();
        setProfile(data);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const getSkinUrl = () => {
    if (profile?.is_premium_minecraft && profile.username) {
      return `https://mc-heads.net/avatar/${profile.username}/40`;
    }
    return `https://mc-heads.net/avatar/Steve/40`;
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    ...(profile?.is_admin ? [{ label: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="ConfessionMC" className="w-10 h-10 rounded-lg" />
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-display text-sm tracking-wider transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-primary/20 text-primary text-glow'
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10">
                    <img
                      src={getSkinUrl()}
                      alt={profile.username}
                      className="w-8 h-8 rounded minecraft-border"
                    />
                    <span className="font-display text-sm text-primary">{profile.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-strong border-border">
                  {profile.is_admin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary font-display"
                onClick={() => setAuthOpen(true)}
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </nav>
  );
};

export default Navbar;
