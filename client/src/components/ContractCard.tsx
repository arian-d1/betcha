import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import type { Contract } from "@/types/Contract";
import type { ContractStatus } from "@/types/ContractStatus";
import { Coins, User2, ShieldCheck, ShieldAlert, Trash2, Loader2 } from "lucide-react";

import { TrophyWinner } from "./ui/TrophyWinner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useContext, useState } from "react";
import { UserContext } from "./contexts/UserContext";
import api from "@/api/axios";


export default function ContractCard({ contract, onDelete }: { contract: Contract, onDelete?: (id: string) => void }) {
  
  const auth = useContext(UserContext);
  
  const STATUS_CONFIG: Record<
  ContractStatus,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "ghost";
    isDisabled: boolean;
  }
  > = {
    open: { label: "Accept Wager", variant: "default", isDisabled: !auth.isAuthenticated },
    active: { label: "In Progress", variant: "secondary", isDisabled: true },
    resolved: { label: "View Result", variant: "outline", isDisabled: false },
    cancelled: { label: "Voided", variant: "ghost", isDisabled: true },
  };

  const config = STATUS_CONFIG[contract.status];
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOwner = auth.user?.id == contract.maker.id;
  const isTrusted = contract.maker.times_banned == 0;

  const hasUserClaimed = isOwner 
    ? contract.maker_claim !== null 
    : auth.user?.id === contract.taker?.id 
      ? contract.taker_claim !== null 
      : false;

  // Accept Wager Handler
  // REQUIRE: User must have sufficient funds
  // EFFECT: Accepting wager will set the currently logged in user as the taker
  //         and change contract status to "active" to the backend/database.
  const acceptWager = async (contractId: string, takingUserId: string) => {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await api.patch(`/contracts/${contractId}/claim`, {
        claimingUserId: takingUserId
      });
      if (response.data.success) {
        window.location.reload();
      }
    } catch (e: any) {
      const errorMsg = e.response?.data.error || "Failed to accept wager";
      setError(errorMsg);
      console.error("Error accepting wager:", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the dialog
    if (!confirm("Are you sure you want to delete this wager?")) return;

    setIsDeleting(true);

    try {
      await api.patch(`/contracts/${contract.id}/cancel`, { userId: auth.user?.id });
      if (onDelete) onDelete(contract.id);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete contract");
    } finally {
      setIsDeleting(false);
    }
  };

  const submitClaim = async (choice: boolean) => {
    const message = choice 
      ? "ARE YOU SURE? Confirming a WIN is IRREVERSIBLE. Lying will result in a BAN." 
      : "ARE YOU SURE? Confirming a LOSS is IRREVERSIBLE. Lying will result in a BAN.";

    if (!window.confirm(message)) return;

    setIsSubmitting(true);
    setError("");
    
    try {
      // Matches your backend: { userId, claim }
      const response = await api.patch(`/contracts/${contract.id}/resolve`, { 
        userId: auth.user?.id,
        claim: choice 
      });
      
      if (response.data.success) {
        window.location.reload(); 
      }
    } catch (e: any) {
      const errorMsg = e.response?.data.error || "Failed to submit claim";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      {/* The Trigger is the card itself */}
      
        <Card className="relative w-full flex flex-col h-full transition-all hover:border-primary/50 overflow-hidden shadow-sm hover:shadow-md">
          {/* Delete Button - Absolute Positioned */}
          {isOwner && contract.status === "open" && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 z-10"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          )}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b bg-muted/5">
            <div className="flex items-center text-sm font-bold text-green-600">
              <Coins className="mr-1.5 h-4 w-4" />${contract.amount.toFixed(2)}
            </div>

          </CardHeader>

          <CardContent className="pt-6 flex-1">
            <CardTitle className="text-lg mb-2 truncate" title={contract.title}>
              {contract.title}
            </CardTitle>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-[2.5rem] leading-relaxed">
              {contract.description}
            </p>

            {/* User Identity Section */}
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 border border-transparent hover:border-muted-foreground/10 transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-background">
                  <User2 className="h-4 w-4 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-sm truncate">
                    @{contract.maker.username}
                  </p>
                  {isTrusted ? (
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500">
                    <title>Verified Maker</title>
                  </ShieldCheck>
                  ) : (
                    <ShieldAlert className="h-3.5 w-3.5 text-yellow-600">
                      <title>Previously Banned</title>
                    </ShieldAlert>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                  {isTrusted
                    ? "Verified Maker"
                    : `${contract.maker.times_banned} violations`}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t bg-muted/10 h-20 flex items-center justify-center shrink-0 px-4">
            {contract.status === "resolved" ? (
              <div className="flex flex-col items-center w-full space-y-1">
                {/* Winner Section */}
                <div className="flex items-center justify-center gap-2">
                  <TrophyWinner name={contract.winner === contract.maker.id ? contract.maker.username : contract.taker?.username} />
                </div>

                {/* Loser Section - De-emphasized */}
                  <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-tight italic">
                    Defeated: {contract.winner === contract.maker.id ? contract.taker?.username : contract.maker.username}
                  </p>
                </div>
            ) : (
              /* Standard Button for all other states */
              <DialogTrigger asChild>
              <Button
                className="w-full font-bold uppercase text-xs tracking-wider"
                variant={config.variant}
              >
                {config.label}
              </Button>
              </DialogTrigger>
            )}
          </CardFooter>
        </Card>

      {/* The Expanded View (Modal) */}
      <DialogContent className="sm:max-w-[525px] border-none shadow-2xl">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center text-sm font-bold text-green-600 mb-2">
            <Coins className="mr-1.5 h-4 w-4" />
            ${contract.amount.toFixed(2)}
          </div>
          <DialogTitle className="text-2xl font-bold leading-tight">
            {contract.title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {/* Full description - no line-clamp here */}
          <h4 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-2">
            Contract Details
          </h4>
          <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
            {contract.description}
          </p>

          <div className="mt-8 p-4 rounded-xl bg-muted/50 border flex items-center gap-4">
             <Avatar className="h-12 w-12 border-2 border-background">
               <AvatarFallback><User2 /></AvatarFallback>
             </Avatar>
             <div>
               <p className="text-sm font-bold">Created by @{contract.maker.username}</p>
               <p className="text-xs text-muted-foreground">
                 {isTrusted ? "Verified Maker" : `${contract.maker.times_banned} violations reported`}
               </p>
             </div>
          </div>

          {/* ERROR ALERT SECTION */}
          {error && (
            <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-3 border-t pt-6">
          {/* LEFT SIDE: WIN/LOSE BUTTONS */}
          {contract.status === "active" && (isOwner || auth.user?.id === contract.taker?.id) && (
            <div className="flex flex-col items-start gap-2 mr-auto">
              {hasUserClaimed ? (
                /* SHOW THIS IF USER HAS ALREADY SENT A CLAIM */
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase italic tracking-wider animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Awaiting Opponent Response...
                </div>
              ) : (
                /* SHOW BUTTONS ONLY IF NO CLAIM SENT YET */
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    className="px-4 font-bold uppercase text-[10px] tracking-widest shadow-lg"
                    disabled={isSubmitting}
                    onClick={() => submitClaim(false)} 
                  >
                    {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "I Lose"}
                  </Button>
                  <Button 
                    className="px-4 bg-green-600 hover:bg-green-700 text-white font-bold uppercase text-[10px] tracking-widest shadow-lg"
                    disabled={isSubmitting}
                    onClick={() => submitClaim(true)}
                  >
                    {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "I Win"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* RIGHT SIDE: CANCEL/CLOSE BUTTONS */}
          <div className="flex flex-row gap-3 ml-auto">
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none px-8">
                {contract.status === "open" ? "Cancel" : "Close"}
              </Button>
            </DialogTrigger>
            
            {contract.status === "open" && (
              <Button 
                className="flex-1 sm:flex-none px-8 bg-green-600 hover:bg-green-700 text-white border-none shadow-lg shadow-green-900/20 disabled:bg-muted disabled:text-muted-foreground"
                onClick={() => {
                  auth.user != null ? acceptWager(contract.id, auth.user.id) : setError("Couldnt go through")
                }}
                disabled={config.isDisabled || isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {auth.isAuthenticated ? "Accept Wager" : "Login to Accept"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
