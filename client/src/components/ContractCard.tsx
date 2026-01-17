import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Contract } from "@/types/Contract";
import { Coins, User2 } from "lucide-react";

export default function ContractCard({ contract }: { contract: Contract }) {
  return (
    <Card className="w-full transition-all hover:border-primary/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center text-sm font-medium text-green-600">
          <Coins className="mr-1 h-4 w-4" />
          ${contract.amount.toFixed(2)}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <CardTitle className="text-xl mb-2">{contract.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {contract.description}
        </p>
        <div className="flex items-center space-x-3 text-sm">
          <Avatar className="h-8 w-8">
            <AvatarFallback><User2 /></AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium leading-none">{contract.maker.name}</p>
            <p className="text-xs text-muted-foreground">{contract.maker.wins} wins</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/20 pt-4">
        <Button className="w-full" variant="default">
          Accept Wager
        </Button>
      </CardFooter>
    </Card>
  );
}