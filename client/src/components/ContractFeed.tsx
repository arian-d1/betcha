import ContractCard from "./ContractCard";
import { MOCK_CONTRACTS } from "@/mock-data/mock-contracts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ContractFeed() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Arena</h1>
          <p className="text-muted-foreground">Accept a challenge or create your own.</p>
        </div>
        <Button size="lg" className="gap-2">
          <PlusCircle className="h-5 w-5" /> Create Contract
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full mb-8">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Bets</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="gaming">Gaming</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CONTRACTS.map((contract) => (
          <ContractCard key={contract.id} contract={contract} />
        ))}
      </div>
    </div>
  );
}