import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  History,
  Trophy,
  LogOut,
} from "lucide-react";
import ContractCard from "@/components/ContractCard";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./contexts/UserContext";
import UnauthorizedPage from "./UnauthorizedPage";
import SetUsernamePage from "./SetUsernamePage"; 
import type { Contract } from "@/types/Contract";
import api from "@/api/axios";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import fetchContracts from "@/lib/fetchContracts";

export default function UserProfile() {
  const auth = useContext(UserContext);
  const [contracts, setContracts] = useState<Array<Contract>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  if (auth.user == null) {
    return <UnauthorizedPage />;
  }

  if (auth.user.username.trim() === "") {
    return <SetUsernamePage />;
  }

  useEffect(() => {
    fetchContracts(setIsLoading, setContracts);
  }, []);
  console.log(contracts)

  const placedWagers = contracts.filter(c => c.maker.id === auth.user?.id);
  const takenWagers = contracts.filter(c => c.taker?.id === auth.user?.id);
  const resolvedContracts = contracts.filter(
    (c) => c.status === "resolved" && (c.maker.id === auth.user?.id || c.taker?.id === auth.user?.id)
  );
  const wins = resolvedContracts.filter((c) => c.winner === auth.user?.id);
  const losses = resolvedContracts.filter((c) => c.winner !== auth.user?.id);

  const totalWinAmount = wins.reduce((sum, c) => sum + c.amount, 0);
  const totalLossAmount = losses.reduce((sum, c) => sum + c.amount, 0);
  const netPnL = totalWinAmount - totalLossAmount;
  const openCount = contracts.filter((c) => c.status === "open" && (c.maker.id === auth.user?.id || c.taker?.id === auth.user?.id)).length;

  if (auth.user == null) return <UnauthorizedPage />;
  if (auth.user.username.trim() === "") return <SetUsernamePage />;

    return (
      <div className="container mx-auto py-10 px-4 max-w-5xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground font-bold">
              {auth.user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">
                @{auth.user.username}
              </h1>
              {auth.user.times_banned === 0 ? (
                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1">
                  <ShieldCheck className="h-3 w-3" /> Trusted
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <ShieldAlert className="h-3 w-3" /> {auth.user.times_banned}{" "}
                  Bans
                </Badge>
              )}

              {/* 3. The Logout Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-destructive gap-2"
                onClick={auth.logout}
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {new Date(auth.user.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1 text-green-600 font-medium">
                <Wallet className="h-4 w-4" />${auth.user.balance.toFixed(2)}{" "}
                Available
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Arena Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Trophy className="h-4 w-4" /> Wins
                  </div>
                  <span className="font-bold text-green-600">{wins.length}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <ShieldAlert className="h-4 w-4" /> Losses
                  </div>
                  <span className="font-bold text-red-500">{losses.length}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <History className="h-4 w-4 text-yellow-500" /> Net P/L:
                  </div>
                  <span className="font-bold">
                    ${netPnL.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4 text-yellow-500" /> Total Wagers
                  </div>
                  <span className="font-bold">{takenWagers.length + placedWagers.length}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <History className="h-4 w-4 text-blue-500" /> Active
                  </div>
                  <span className="font-bold">
                    {contracts.filter((c) => c.status === "active").length}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    {/* Using a different icon or color to distinguish from 'Active' */}
                    <History className="h-4 w-4 text-cyan-500" /> Open Wagers
                  </div>
                  <span className="font-bold">{openCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content: User's History */}
          <div className="md:col-span-2">
            <Tabs defaultValue="placed" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="wins">Wins ({wins.length})</TabsTrigger>
                <TabsTrigger value="losses">Losses ({losses.length})</TabsTrigger>
                <TabsTrigger value="placed">Placed ({placedWagers.length})</TabsTrigger>
                <TabsTrigger value="taken">Taken ({takenWagers.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="placed" className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
                ) : placedWagers.length > 0 ? (
                  placedWagers.map((c) => (
                    <ContractCard key={c.id} contract={c} onDelete={() => {}} />
                  ))
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
                    No wagers placed.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="taken" className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
                ) : takenWagers.length > 0 ? (
                  takenWagers.map((c) => (
                    <ContractCard key={c.id} contract={c} />
                  ))
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
                    No wagers taken.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="wins" className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-primary" />
                  </div>
                ) : wins.length > 0 ? (
                  wins.map((c) => (
                    <ContractCard key={c.id} contract={c} />
                  ))
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
                    No wins yet.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="losses" className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-primary" />
                  </div>
                ) : losses.length > 0 ? (
                  losses.map((c) => (
                    <ContractCard key={c.id} contract={c} />
                  ))
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
                    No losses yet.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }