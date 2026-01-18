import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, ShieldCheck, ShieldAlert, Calendar, History, Trophy } from "lucide-react";
import { MOCK_CONTRACTS } from "@/mock-data/mock-contracts";
import ContractCard from "@/components/ContractCard";
import { useContext } from "react";
import { UserContext } from "./contexts/UserContext";
import UnauthorizedPage from "./UnauthorizedPage";

export default function UserProfile() {
  const user = useContext(UserContext);
  // In a real app, you'd fetch this from your DB using the userid
  // For now, we'll find the user from our mock contracts
  if (user.user == null) {
    return <UnauthorizedPage/>
  }
  const userContracts = user.user == null ? [] : MOCK_CONTRACTS.filter(
    (c) => c.maker.id === user.user.id || c.taker?.id === user.user.id
  );

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
        <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
          <AvatarFallback className="text-2xl bg-primary text-primary-foreground font-bold">
            {user.user.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight">@{user.user.username}</h1>
            {user.user.times_banned === 0 ? (
              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1">
                <ShieldCheck className="h-3 w-3" /> Trusted
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <ShieldAlert className="h-3 w-3" /> {user.user.times_banned} Bans
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined {new Date(user.user.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <Wallet className="h-4 w-4" />
              ${user.user.balance.toFixed(2)} Available
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
                <span className="font-bold">{userContracts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                  <History className="h-4 w-4 text-blue-500" /> Active
                </div>
                <span className="font-bold">
                  {userContracts.filter(c => c.status === 'active').length}
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
              <div className="grid grid-cols-1 gap-4">
                {userContracts.length > 0 ? (
                  userContracts.map((c) => (
                    <ContractCard key={c.id} contract={c} />
                  ))
                ) : (
                  <p className="text-center py-10 text-muted-foreground">No recent wagers.</p>
                )}
              </div>
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