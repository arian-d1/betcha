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
import { Coins, User2, ShieldCheck, ShieldAlert } from "lucide-react";

import { TrophyWinner } from "./ui/TrophyWinner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useContext } from "react";
import { UserContext } from "./contexts/UserContext";


export default function ContractCard({ contract }: { contract: Contract }) {
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
  const isTrusted = contract.maker.times_banned == 0;

  return (
    <Dialog>
      {/* The Trigger is the card itself */}
      
        <Card className="w-full flex flex-col h-full transition-all hover:border-primary/50 overflow-hidden shadow-sm hover:shadow-md">
      
        <Card className="w-full flex flex-col h-full transition-all hover:border-primary/50 overflow-hidden shadow-sm hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b bg-muted/5">
            <div className="flex items-center text-sm font-bold text-green-600">
              <Coins className="mr-1.5 h-4 w-4" />${contract.amount.toFixed(2)}
            </div>
            {/* <Badge variant="outline" className="text-[10px] font-mono uppercase px-2 py-0">
              {contract.id}
            </Badge> */}
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
              <DialogTrigger asChild>
              <Button
                className="w-full font-bold uppercase text-xs tracking-wider"
                variant={config.variant}
              >
                {config.label}
              </Button>
              </DialogTrigger>
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
        </div>

        <DialogFooter className="flex flex-row gap-3 sm:justify-end border-t pt-6">
          {/* Cancel Button - White/Outline */}
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1 sm:flex-none px-8">
              {contract.status === "open" ? "Cancel" : "Close"}
            </Button>
          </DialogTrigger>
          
          {/* Only show the Accept button if the status is 'open' */}
          {contract.status === "open" && (
            <DialogTrigger asChild>
              <Button 
                className="flex-1 sm:flex-none px-8 bg-green-600 hover:bg-green-700 text-white border-none shadow-lg shadow-green-900/20 disabled:bg-muted disabled:text-muted-foreground"
                onClick={() => console.log("Wager Accepted")}
                // Logic: Disabled if already disabled in config (e.g., user not logged in)
                disabled={config.isDisabled}
              >
                {auth.isAuthenticated ? "Accept Wager" : "Login to Accept"}
              </Button>
            </DialogTrigger>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
