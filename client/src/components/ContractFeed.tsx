import ContractCard from "./ContractCard";
import type { Contract } from "@/types/Contract";
import { MOCK_CONTRACTS } from "@/mock-data/mock-contracts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export default function ContractFeed() {
  const [contracts, setContracts] = useState<Array<Contract>>(MOCK_CONTRACTS);
  const [activeTab, setActiveTab] = useState<string>("open");

  const filteredContracts = contracts.filter((contract) => {
    if (activeTab === "all") return true;
    // Ensure your mock data categories match these values (case-sensitive)
    return contract.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Arena</h1>
          <p className="text-muted-foreground">
            Accept a challenge or create your own.
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <PlusCircle className="h-5 w-5" /> Create Contract
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mb-8"
      >
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="open">Open Bets</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Changed MOCK_CONTRACTS to filteredContracts */}
        {filteredContracts.length > 0 ? (
          filteredContracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">
              No contracts found for this status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
