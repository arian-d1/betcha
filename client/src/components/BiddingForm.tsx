import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, Send, Loader2, Coins, ShieldAlert } from "lucide-react";

interface BiddingFormProps {
  currentAmount: number;
  proposedPrice: string;
  setProposedPrice: (val: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string;
}

export function BiddingForm({
  currentAmount,
  proposedPrice,
  setProposedPrice,
  onBack,
  onSubmit,
  isSubmitting,
  error,
}: BiddingFormProps) {
  return (
    <div className="space-y-6 py-2 animate-in fade-in slide-in-from-right-4 duration-300">
      <DialogHeader>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-fit -ml-2 mb-2 text-muted-foreground hover:text-primary transition-colors"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Contract
        </Button>
        <DialogTitle className="text-2xl font-bold">Propose a Raise</DialogTitle>
        <DialogDescription>
          Negotiate the stakes. This will send a notification to the creator.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Proposed Stake ($)
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 font-bold">
              <Coins className="h-5 w-5" />
            </div>
            <Input
              type="number"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(e.target.value)}
              className="pl-10 h-14 text-xl font-bold border-2 focus-visible:ring-green-500"
              placeholder="0.00"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            The current wager is <span className="font-bold text-foreground">${currentAmount.toFixed(2)}</span>. 
            Proposed raises must be higher than this amount.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button 
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-widest shadow-lg"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Send Proposal
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-12" 
          onClick={onBack}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}