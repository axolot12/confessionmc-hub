import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Ticket } from 'lucide-react';

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  discordUrl: string;
}

const PurchaseDialog = ({ open, onOpenChange, itemName, discordUrl }: PurchaseDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="font-display text-2xl text-primary text-glow">
            Purchase {itemName}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            To complete your purchase, please follow these steps:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="glass rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-primary font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Join our Discord</p>
                <p className="text-sm text-muted-foreground">Click the button below to join our server</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-primary font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Create a Ticket</p>
                <p className="text-sm text-muted-foreground">Open a support ticket in the Discord server</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-accent font-bold">OR</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Mention @axobhaiya</p>
                <p className="text-sm text-muted-foreground">Tag axobhaiya in Discord to buy your rank directly</p>
              </div>
            </div>
          </div>

          <Button
            asChild
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-display glow-accent"
          >
            <a href={discordUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              Join Discord Server
            </a>
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Our team will assist you with your purchase!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;
