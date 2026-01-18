import api from "@/api/axios";

export default async function fetchContracts(setIsLoading, setContracts) {
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
                const taker = contract.taker ? await api.get(`/user/${contract.taker}`) : null;
                
                // Return the contract but replace the maker string with the user object
                return {
                ...contract,
                maker: userRes.data.data, // This contains username, times_banned, etc.
                taker: taker ? taker.data.data : taker
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