import ContractCard from "./ContractCard";
import type { Contract } from "@/types/Contract";
import { MOCK_CONTRACTS } from "@/mock-data/mock-contracts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext, useState, useEffect } from "react";
import CreateContractModal from "./CreateContractModal";
import { UserContext } from "./contexts/UserContext";
import api from "@/api/axios";
import { Loader2 } from "lucide-react";

export default function ContractFeed() {
  const [contracts, setContracts] = useState<Array<Contract>>([]);
  const [activeTab, setActiveTab] = useState<string>("open");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const auth = useContext(UserContext);

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

  const filteredContracts = contracts.filter((contract) => {
    if (activeTab === "all") return true;
    return contract.status.toLowerCase() === activeTab.toLowerCase();
  });

  const handleAddContract = (newContract: Contract) => {
    setContracts((prev) => [newContract, ...prev]);
  };

  const handleDeleteFromState = (id: string) => {
    setContracts((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Arena</h1>
          <p className="text-muted-foreground">
            Accept a challenge or create your own.
          </p>
        </div>
        
        <CreateContractModal isDisabled={!auth.isAuthenticated} onContractCreated={handleAddContract} />
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading Arena...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.length > 0 ? (
            filteredContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} onDelete={handleDeleteFromState}/>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No contracts found for this status.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
