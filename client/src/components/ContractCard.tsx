import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; // Ensure you've added the badge component
import type { Contract } from "@/types/Contract";
import type { ContractStatus } from "@/types/ContractStatus";
import { Coins, User2, ShieldCheck, ShieldAlert } from "lucide-react";

const STATUS_CONFIG: Record<
  ContractStatus,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "ghost";
    isDisabled: boolean;
  }
> = {
  open: { label: "Accept Wager", variant: "default", isDisabled: false },
  active: { label: "In Progress", variant: "secondary", isDisabled: true },
  resolved: { label: "View Result", variant: "outline", isDisabled: false },
  cancelled: { label: "Voided", variant: "ghost", isDisabled: true },
};

export default function ContractCard({ contract }: { contract: Contract }) {
  const config = STATUS_CONFIG[contract.status];
  const isTrusted = contract.maker.times_banned == 0;

  return (
    <Card className="w-full flex flex-col h-full transition-all hover:border-primary/50 overflow-hidden shadow-sm">
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
                <ShieldCheck
                  className="h-3.5 w-3.5 text-blue-500"
                  title="Trusted Player"
                />
              ) : (
                <ShieldAlert
                  className="h-3.5 w-3.5 text-yellow-600"
                  title="Previously Banned"
                />
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

      <CardFooter className="border-t bg-muted/10 h-16 flex items-center justify-center shrink-0 px-4">
        <Button
          className="w-full font-bold uppercase text-xs tracking-wider"
          variant={config.variant}
          disabled={config.isDisabled}
        >
          {config.label}
        </Button>
      </CardFooter>
    </Card>
  );
}
