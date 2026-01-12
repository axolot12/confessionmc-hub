import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import ServerStatus from '@/components/ServerStatus';
import Navbar from '@/components/Navbar';
import logo from '@/assets/logo.png';

interface SiteConfig {
  server_name: string;
  server_ip: string;
  server_port: number;
  discord_url: string;
  logo_url?: string;
}

const Index = () => {
  const [config, setConfig] = useState<SiteConfig>({
    server_name: 'ConfessionMc',
    server_ip: 'play.confessionmc.fun',
    server_port: 25594,
    discord_url: 'https://discord.gg/nphym8nWXU',
  });

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from('site_config')
        .select('*')
        .maybeSingle();
      
      if (data) {
        setConfig(data);
      }
    };

    fetchConfig();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('site_config_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, (payload) => {
        if (payload.new) {
          setConfig(payload.new as SiteConfig);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="mb-8 animate-float">
              <img
                src={config.logo_url || logo}
                alt={config.server_name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl minecraft-border animate-pulse-glow"
              />
            </div>

            {/* Server Name */}
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary text-glow mb-4 animate-fade-in">
              {config.server_name}
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Join the ultimate Minecraft experience with amazing ranks, events, and a welcoming community!
            </p>

            {/* Server Status */}
            <div className="w-full max-w-2xl mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <ServerStatus ip={config.server_ip} port={config.server_port} />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button
                asChild
                size="lg"
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-display text-lg px-8 py-6 glow-accent"
              >
                <a href={config.discord_url} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Join Discord
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg px-8 py-6 glow-primary"
              >
                <Link to="/shop">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Visit Shop
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-12">
            Why Choose <span className="text-primary text-glow">{config.server_name}</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Epic Ranks',
                description: 'Unlock amazing abilities and perks with our unique rank system',
                color: 'primary',
              },
              {
                title: 'Active Community',
                description: 'Join thousands of players in our vibrant Discord community',
                color: 'accent',
              },
              {
                title: 'Regular Events',
                description: 'Participate in weekly events with exclusive rewards',
                color: 'primary',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <h3 className={`font-display text-xl text-${feature.color} mb-3`}>{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 {config.server_name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
