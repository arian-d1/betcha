import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Coins, Banknote, Loader2, AlertCircle } from "lucide-react";
import { UserContext } from "./contexts/UserContext";
import api from "@/api/axios";
// --- UNIFIED LOGIC HELPER ---
const useWalletAction = (onComplete: () => void) => {
  const auth = useContext(UserContext);
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const processTransaction = async (type: "deposit" | "withdraw") => {
    if (!auth.user || !amount) return;
    
    const numAmount = Number(amount);
    if (numAmount <= 0) {
      setError("Please enter an amount greater than 0");
      return;
    }

    // Guard for withdrawals
    if (type === "withdraw" && numAmount > auth.user.balance) {
      setError("Insufficient funds in wallet");
      return;
    }

    setError("");
    setLoading(true);
    
    try {
      // Calculate final total to send to the server
      const newBalance = type === "deposit" 
        ? auth.user.balance + numAmount 
        : auth.user.balance - numAmount;

      const response = await api.patch(`/user/setBalance/${auth.user.id}`, {
        balance: newBalance
      });

      if (response.data.success) {
        // Force reload to sync Navbar and Context balance
        window.location.reload(); 
        onComplete();
      }
    } catch (e: any) {
      setError(e.response?.data.error || `Failed to process ${type}`);
    } finally {
      setLoading(false);
    }
  };

  return { amount, setAmount, loading, error, processTransaction, currentBalance: auth.user?.balance ?? 0 };
};


export function DepositModal({ onComplete }: { onComplete: () => void }) {
  const { amount, setAmount, loading, error, processTransaction, currentBalance } = useWalletAction(onComplete);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
          <Coins className="text-green-600 h-6 w-6" /> Add Funds
        </DialogTitle>
      </DialogHeader>
      
      <div className="py-6 space-y-4">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg flex gap-2 items-center border border-destructive/20 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}
        
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount to Deposit</label>
            <span className="text-[10px] font-medium text-muted-foreground/60">Balance: ${currentBalance.toFixed(2)}</span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
            <Input 
              type="number" 
              placeholder="0.00" 
              className="pl-7 h-12 text-lg font-semibold"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button 
          className="w-full h-12 bg-green-600 hover:bg-green-700 font-bold uppercase tracking-widest" 
          onClick={() => processTransaction("deposit")} 
          disabled={loading || !amount}
        >
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Confirm Deposit"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export function WithdrawModal({ onComplete }: { onComplete: () => void }) {
  const { amount, setAmount, loading, error, processTransaction, currentBalance } = useWalletAction(onComplete);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
          <Banknote className="text-blue-600 h-6 w-6" /> Withdraw Funds
        </DialogTitle>
      </DialogHeader>

      <div className="py-6 space-y-4">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg flex gap-2 items-center border border-destructive/20 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount to Withdraw</label>
            <span className="text-[10px] font-medium text-muted-foreground/60">Available: ${currentBalance.toFixed(2)}</span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
            <Input 
              type="number" 
              placeholder="0.00" 
              className="pl-7 h-12 text-lg font-semibold"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <p className="text-[10px] text-center text-muted-foreground italic px-4">
          Withdrawals are sent to your connected account. Standard processing times apply.
        </p>
      </div>

      <DialogFooter>
        <Button 
          variant="outline"
          className="w-full h-12 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold uppercase tracking-widest" 
          onClick={() => processTransaction("withdraw")} 
          disabled={loading || !amount}
        >
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Request Transfer"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}