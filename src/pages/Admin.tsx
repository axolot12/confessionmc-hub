import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Settings, Crown, Key, Save, Plus, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface SiteConfig {
  id: string;
  server_name: string;
  server_ip: string;
  server_port: number;
  discord_url: string;
  logo_url: string | null;
}

interface Rank {
  id: string;
  name: string;
  description: string | null;
  price: number;
  features: string[];
  color: string;
  is_free: boolean;
  how_to_get: string | null;
  display_order: number;
}

interface KeyItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  color: string;
  display_order: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [keys, setKeys] = useState<KeyItem[]>([]);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!profile?.is_admin) {
        navigate('/');
        return;
      }

      setIsAdmin(true);
      await fetchData();
    };

    checkAdmin();
  }, [navigate]);

  const fetchData = async () => {
    const [configRes, ranksRes, keysRes] = await Promise.all([
      supabase.from('site_config').select('*').maybeSingle(),
      supabase.from('ranks').select('*').order('display_order'),
      supabase.from('keys').select('*').order('display_order'),
    ]);

    if (configRes.data) setConfig(configRes.data);
    if (ranksRes.data) setRanks(ranksRes.data);
    if (keysRes.data) setKeys(keysRes.data);
    setLoading(false);
  };

  const saveConfig = async () => {
    if (!config) return;
    setSaving(true);

    const { error } = await supabase
      .from('site_config')
      .update({
        server_name: config.server_name,
        server_ip: config.server_ip,
        server_port: config.server_port,
        discord_url: config.discord_url,
        logo_url: config.logo_url,
      })
      .eq('id', config.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Saved!', description: 'Site configuration updated.' });
    }
    setSaving(false);
  };

  const saveRank = async (rank: Rank) => {
    setSaving(true);
    const { error } = await supabase
      .from('ranks')
      .update({
        name: rank.name,
        description: rank.description,
        price: rank.price,
        features: rank.features,
        color: rank.color,
        is_free: rank.is_free,
        how_to_get: rank.how_to_get,
        display_order: rank.display_order,
      })
      .eq('id', rank.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Saved!', description: `Rank "${rank.name}" updated.` });
    }
    setSaving(false);
  };

  const addRank = async () => {
    const { data, error } = await supabase
      .from('ranks')
      .insert({
        name: 'New Rank',
        description: 'Description',
        price: 9.99,
        features: ['Feature 1', 'Feature 2'],
        color: '#00D9FF',
        display_order: ranks.length + 1,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else if (data) {
      setRanks([...ranks, data]);
      toast({ title: 'Added!', description: 'New rank created.' });
    }
  };

  const deleteRank = async (id: string) => {
    const { error } = await supabase.from('ranks').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setRanks(ranks.filter((r) => r.id !== id));
      toast({ title: 'Deleted!', description: 'Rank removed.' });
    }
  };

  const saveKey = async (key: KeyItem) => {
    setSaving(true);
    const { error } = await supabase
      .from('keys')
      .update({
        name: key.name,
        description: key.description,
        price: key.price,
        color: key.color,
        display_order: key.display_order,
      })
      .eq('id', key.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Saved!', description: `Key "${key.name}" updated.` });
    }
    setSaving(false);
  };

  const addKey = async () => {
    const { data, error } = await supabase
      .from('keys')
      .insert({
        name: 'New Key',
        description: 'Description',
        price: 4.99,
        color: '#A855F7',
        display_order: keys.length + 1,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else if (data) {
      setKeys([...keys, data]);
      toast({ title: 'Added!', description: 'New key created.' });
    }
  };

  const deleteKey = async (id: string) => {
    const { error } = await supabase.from('keys').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setKeys(keys.filter((k) => k.id !== id));
      toast({ title: 'Deleted!', description: 'Key removed.' });
    }
  };

  const updateRank = (id: string, field: keyof Rank, value: any) => {
    setRanks(ranks.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const updateKey = (id: string, field: keyof KeyItem, value: any) => {
    setKeys(keys.map((k) => (k.id === id ? { ...k, [field]: value } : k)));
  };

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-display text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-primary text-glow mb-2">
              Admin Panel
            </h1>
            <p className="text-muted-foreground">Manage your server website</p>
          </div>

          <Tabs defaultValue="general" className="max-w-4xl mx-auto">
            <TabsList className="glass w-full grid grid-cols-3 mb-8">
              <TabsTrigger value="general" className="font-display">
                <Settings className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="ranks" className="font-display">
                <Crown className="w-4 h-4 mr-2" />
                Ranks
              </TabsTrigger>
              <TabsTrigger value="keys" className="font-display">
                <Key className="w-4 h-4 mr-2" />
                Keys
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="animate-fade-in">
              <div className="glass rounded-xl p-6 space-y-6">
                <h2 className="font-display text-xl text-primary mb-4">Site Configuration</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Server Name</Label>
                    <Input
                      value={config?.server_name || ''}
                      onChange={(e) => setConfig(config ? { ...config, server_name: e.target.value } : null)}
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Server IP</Label>
                    <Input
                      value={config?.server_ip || ''}
                      onChange={(e) => setConfig(config ? { ...config, server_ip: e.target.value } : null)}
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Server Port</Label>
                    <Input
                      type="number"
                      value={config?.server_port || ''}
                      onChange={(e) => setConfig(config ? { ...config, server_port: parseInt(e.target.value) } : null)}
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Discord URL</Label>
                    <Input
                      value={config?.discord_url || ''}
                      onChange={(e) => setConfig(config ? { ...config, discord_url: e.target.value } : null)}
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Logo URL (optional)</Label>
                    <Input
                      value={config?.logo_url || ''}
                      onChange={(e) => setConfig(config ? { ...config, logo_url: e.target.value } : null)}
                      placeholder="https://example.com/logo.png"
                      className="bg-input border-border"
                    />
                  </div>
                </div>

                <Button onClick={saveConfig} disabled={saving} className="bg-primary text-primary-foreground font-display">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </TabsContent>

            {/* Ranks Management */}
            <TabsContent value="ranks" className="animate-fade-in space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-display text-xl text-primary">Manage Ranks</h2>
                <Button onClick={addRank} size="sm" className="bg-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rank
                </Button>
              </div>

              {ranks.map((rank) => (
                <div key={rank.id} className="glass rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display text-lg" style={{ color: rank.color }}>{rank.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRank(rank.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={rank.name}
                        onChange={(e) => updateRank(rank.id, 'name', e.target.value)}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={rank.price}
                        onChange={(e) => updateRank(rank.id, 'price', parseFloat(e.target.value))}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={rank.color}
                          onChange={(e) => updateRank(rank.id, 'color', e.target.value)}
                          className="w-12 h-10 p-1 bg-input border-border"
                        />
                        <Input
                          value={rank.color}
                          onChange={(e) => updateRank(rank.id, 'color', e.target.value)}
                          className="bg-input border-border flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={rank.description || ''}
                      onChange={(e) => updateRank(rank.id, 'description', e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Features (one per line)</Label>
                    <Textarea
                      value={rank.features.join('\n')}
                      onChange={(e) => updateRank(rank.id, 'features', e.target.value.split('\n'))}
                      className="bg-input border-border min-h-24"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rank.is_free}
                        onChange={(e) => updateRank(rank.id, 'is_free', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Free Rank</span>
                    </label>
                  </div>

                  {rank.is_free && (
                    <div className="space-y-2">
                      <Label>How to Get</Label>
                      <Textarea
                        value={rank.how_to_get || ''}
                        onChange={(e) => updateRank(rank.id, 'how_to_get', e.target.value)}
                        className="bg-input border-border"
                      />
                    </div>
                  )}

                  <Button onClick={() => saveRank(rank)} disabled={saving} size="sm" className="bg-primary text-primary-foreground">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              ))}
            </TabsContent>

            {/* Keys Management */}
            <TabsContent value="keys" className="animate-fade-in space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-display text-xl text-primary">Manage Keys</h2>
                <Button onClick={addKey} size="sm" className="bg-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Key
                </Button>
              </div>

              {keys.map((key) => (
                <div key={key.id} className="glass rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display text-lg" style={{ color: key.color }}>{key.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteKey(key.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={key.name}
                        onChange={(e) => updateKey(key.id, 'name', e.target.value)}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={key.price}
                        onChange={(e) => updateKey(key.id, 'price', parseFloat(e.target.value))}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={key.color}
                          onChange={(e) => updateKey(key.id, 'color', e.target.value)}
                          className="w-12 h-10 p-1 bg-input border-border"
                        />
                        <Input
                          value={key.color}
                          onChange={(e) => updateKey(key.id, 'color', e.target.value)}
                          className="bg-input border-border flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={key.description || ''}
                      onChange={(e) => updateKey(key.id, 'description', e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>

                  <Button onClick={() => saveKey(key)} disabled={saving} size="sm" className="bg-primary text-primary-foreground">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
