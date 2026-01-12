import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Key, Gift } from 'lucide-react';
import RankCard from '@/components/RankCard';
import KeyCard from '@/components/KeyCard';
import Navbar from '@/components/Navbar';

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

const Shop = () => {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [keys, setKeys] = useState<KeyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [ranksRes, keysRes] = await Promise.all([
        supabase.from('ranks').select('*').order('display_order'),
        supabase.from('keys').select('*').order('display_order'),
      ]);

      if (ranksRes.data) setRanks(ranksRes.data);
      if (keysRes.data) setKeys(keysRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const paidRanks = ranks.filter((r) => !r.is_free);
  const freeRanks = ranks.filter((r) => r.is_free);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary text-glow mb-4">
              Server Shop
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enhance your gameplay with exclusive ranks and keys
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="ranks" className="w-full">
            <TabsList className="glass w-full max-w-md mx-auto grid grid-cols-3 mb-10">
              <TabsTrigger
                value="ranks"
                className="font-display data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Crown className="w-4 h-4 mr-2" />
                Ranks
              </TabsTrigger>
              <TabsTrigger
                value="keys"
                className="font-display data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Key className="w-4 h-4 mr-2" />
                Keys
              </TabsTrigger>
              <TabsTrigger
                value="free"
                className="font-display data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Gift className="w-4 h-4 mr-2" />
                Free
              </TabsTrigger>
            </TabsList>

            {/* Ranks Tab */}
            <TabsContent value="ranks" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="glass rounded-xl h-80 animate-pulse" />
                  ))
                ) : (
                  paidRanks.map((rank) => (
                    <RankCard
                      key={rank.id}
                      name={rank.name}
                      description={rank.description || undefined}
                      price={Number(rank.price)}
                      features={rank.features}
                      color={rank.color}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            {/* Keys Tab */}
            <TabsContent value="keys" className="animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="glass rounded-xl h-52 animate-pulse" />
                  ))
                ) : (
                  keys.map((key) => (
                    <KeyCard
                      key={key.id}
                      name={key.name}
                      description={key.description || undefined}
                      price={Number(key.price)}
                      color={key.color}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            {/* Free Tab */}
            <TabsContent value="free" className="animate-fade-in">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl text-primary mb-2">Free Ranks</h2>
                  <p className="text-muted-foreground">
                    Earn these ranks by playing and contributing to the server!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="glass rounded-xl h-72 animate-pulse" />
                    ))
                  ) : (
                    freeRanks.map((rank) => (
                      <RankCard
                        key={rank.id}
                        name={rank.name}
                        description={rank.description || undefined}
                        price={0}
                        features={rank.features}
                        color={rank.color}
                        isFree={true}
                        howToGet={rank.how_to_get || undefined}
                      />
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Shop;
