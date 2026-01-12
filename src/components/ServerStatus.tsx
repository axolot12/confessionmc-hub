import { useState, useEffect } from 'react';
import { Copy, Check, Users, Signal, SignalZero } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ServerStatusProps {
  ip: string;
  port: number;
}

interface ServerData {
  online: boolean;
  players: {
    online: number;
    max: number;
  };
  motd?: {
    clean?: string[];
  };
}

const ServerStatus = ({ ip, port }: ServerStatusProps) => {
  const [status, setStatus] = useState<ServerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`https://api.mcsrvstat.us/3/${ip}:${port}`);
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Failed to fetch server status:', error);
        setStatus({ online: false, players: { online: 0, max: 0 } });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [ip, port]);

  const copyIP = () => {
    navigator.clipboard.writeText(`${ip}:${port}`);
    setCopied(true);
    toast({
      title: 'IP Copied!',
      description: `${ip}:${port} copied to clipboard`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass minecraft-border rounded-xl p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-4">
          <div className={`w-4 h-4 rounded-full ${status?.online ? 'bg-online animate-pulse' : 'bg-offline'}`} />
          <div>
            <p className="text-muted-foreground text-sm">Server Status</p>
            <p className={`font-display text-lg ${status?.online ? 'text-online' : 'text-offline'}`}>
              {loading ? 'Checking...' : status?.online ? 'ONLINE' : 'OFFLINE'}
            </p>
          </div>
        </div>

        {/* Players */}
        <div className="flex items-center gap-4">
          <Users className="w-6 h-6 text-primary" />
          <div>
            <p className="text-muted-foreground text-sm">Players Online</p>
            <p className="font-display text-lg text-foreground">
              {loading ? '...' : `${status?.players?.online ?? 0}/${status?.players?.max ?? 0}`}
            </p>
          </div>
        </div>

        {/* IP Copy */}
        <div className="flex items-center gap-2">
          <div className="bg-secondary/50 px-4 py-2 rounded-lg border border-border">
            <p className="text-muted-foreground text-xs">Server IP</p>
            <p className="font-display text-primary text-sm">{ip}:{port}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={copyIP}
            className="border-primary/50 text-primary hover:bg-primary/10"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServerStatus;
