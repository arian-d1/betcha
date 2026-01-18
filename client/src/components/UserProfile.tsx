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
    const fetchContracts = async () => {
      try {
        setIsLoading(true);

        const response = await api.get("/contracts");
        const rawContracts = response.data.data || response.data;

        if (Array.isArray(rawContracts)) {
        // Hydrate each contract by fetching its maker's profile
        const hydratedContracts = await Promise.all(
          rawContracts.map(async (contract: any) => {
            try {
              // The contract 'maker' is currently just an ID string
              const userId = contract.maker; 
              
              // Fetch the full user profile from your user router
              const userRes = await api.get(`/user/${userId}`);
              
              // Return the contract but replace the maker string with the user object
              return {
                ...contract,
                maker: userRes.data.data // This contains username, times_banned, etc.
              };
            } catch (err) {
              console.error(`Failed to fetch profile for user ${contract.maker}`, err);
              return contract; // Fallback to original if user fetch fails
            }
          })
        );

        setContracts(hydratedContracts);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchContracts();
}, []);

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
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4 text-yellow-500" /> Total Wagers
                  </div>
                  <span className="font-bold">{contracts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <History className="h-4 w-4 text-blue-500" /> Active
                  </div>
                  <span className="font-bold">
                    {contracts.filter((c) => c.status === "active").length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content: User's History */}
          <div className="md:col-span-2">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="stats">Detailed Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="space-y-6">
              {isLoading ? (
                /* LOADER WHEEL SECTION */
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-muted-foreground animate-pulse text-sm">
                    Retrieving your wagers...
                  </p>
                </div>
              ) : (
                /* ACTUAL CONTENT */
                <div className="grid grid-cols-1 gap-4">
                  {contracts.length > 0 ? (
                    contracts.map((c) => (
                      <ContractCard key={c.id} contract={c} />
                    ))
                  ) : (
                    <p className="text-center py-10 text-muted-foreground italic border-2 border-dashed rounded-lg">
                      No recent wagers found.
                    </p>
                  )}
                </div>
              )}
            </TabsContent>

              <TabsContent value="stats">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground text-center py-10">
                      Advanced analytics coming soon.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }