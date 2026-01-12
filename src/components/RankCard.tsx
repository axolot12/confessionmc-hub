import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PurchaseDialog from './PurchaseDialog';

interface RankCardProps {
  name: string;
  description?: string;
  price: number;
  features: string[];
  color: string;
  isFree?: boolean;
  howToGet?: string;
  discordUrl?: string;
}

const RankCard = ({ name, description, price, features, color, isFree, howToGet, discordUrl = 'https://discord.gg/nphym8nWXU' }: RankCardProps) => {
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  return (
    <>
      <div
        className="glass rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1 group"
        style={{
          borderColor: color,
          borderWidth: '2px',
          boxShadow: `0 0 20px ${color}30, inset 0 0 30px ${color}10`,
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h3
            className="font-display text-2xl font-bold mb-1"
            style={{ color, textShadow: `0 0 15px ${color}80` }}
          >
            {name}
          </h3>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          {isFree ? (
            <div
              className="font-display text-3xl font-bold"
              style={{ color }}
            >
              FREE
            </div>
          ) : (
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-muted-foreground text-lg">$</span>
              <span
                className="font-display text-4xl font-bold"
                style={{ color }}
              >
                {price.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color }} />
              <span className="text-foreground/90 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* How to Get (for free ranks) */}
        {isFree && howToGet && (
          <div className="bg-secondary/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">How to get:</span>{' '}
              {howToGet}
            </p>
          </div>
        )}

        {/* Button */}
        {!isFree && (
          <Button
            onClick={() => setPurchaseOpen(true)}
            className="w-full font-display transition-all duration-300"
            style={{
              backgroundColor: color,
              color: '#0a0f1a',
              boxShadow: `0 0 20px ${color}50`,
            }}
          >
            Purchase
          </Button>
        )}
      </div>

      <PurchaseDialog
        open={purchaseOpen}
        onOpenChange={setPurchaseOpen}
        itemName={name}
        discordUrl={discordUrl}
      />
    </>
  );
};

export default RankCard;
