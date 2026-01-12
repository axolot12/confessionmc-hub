import { Key } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KeyCardProps {
  name: string;
  description?: string;
  price: number;
  color: string;
}

const KeyCard = ({ name, description, price, color }: KeyCardProps) => {
  return (
    <div
      className="glass rounded-xl p-5 transition-all duration-300 hover:scale-105 group flex flex-col items-center text-center"
      style={{
        borderColor: color,
        borderWidth: '2px',
        boxShadow: `0 0 15px ${color}25`,
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
        style={{
          backgroundColor: `${color}20`,
          boxShadow: `0 0 20px ${color}30`,
        }}
      >
        <Key className="w-8 h-8" style={{ color }} />
      </div>

      <h3
        className="font-display text-lg font-bold mb-1"
        style={{ color }}
      >
        {name}
      </h3>

      {description && (
        <p className="text-muted-foreground text-xs mb-3">{description}</p>
      )}

      <div className="flex items-baseline gap-0.5 mb-4">
        <span className="text-muted-foreground text-sm">$</span>
        <span className="font-display text-2xl font-bold" style={{ color }}>
          {price.toFixed(2)}
        </span>
      </div>

      <Button
        size="sm"
        className="font-display transition-all duration-300"
        style={{
          backgroundColor: color,
          color: '#0a0f1a',
          boxShadow: `0 0 15px ${color}40`,
        }}
      >
        Buy Key
      </Button>
    </div>
  );
};

export default KeyCard;
