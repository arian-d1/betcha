"use client";
import { useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Coins, Loader2 } from "lucide-react";
import { UserContext } from "./contexts/UserContext";
import api from "@/api/axios";

export default function CreateContractModal({ onContractCreated, isDisabled }: { onContractCreated: (newContract: any) => void, isDisabled: boolean }) {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    setError("")
    try {
        const response = await api.post(`/user/${user.id}/newcontract`, {
            contractTitle: title,
            contractDescription: description,
            contractAmount: parseFloat(amount),
        });
        if (response.data.success) {
            // The backend returns the new contract in response.data.data
            const createdContract = response.data.data;
            
            // Pass the new contract back to the feed to update UI
            onContractCreated(createdContract);
            
            // Close and reset
            setOpen(false);
            setTitle("");
            setDescription("");
            setAmount(""); 
        } 
    } catch (err: any) {
      console.error("Failed to create contract:", err);
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 shadow-lg hover:shadow-primary/20 transition-all">
          <PlusCircle className="h-5 w-5" /> Create Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Wager</DialogTitle>
          <DialogDescription>
            Define the terms of your challenge. Others will be able to see and accept this in the Arena.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
            <div className="p-3 rounded-md bg-destructive/15 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in zoom-in duration-200">
                {error}
            </div> 
        )}  
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Contract Title</Label>
            <Input
              id="title"
              placeholder="e.g. 1v1 Rust Quickscopes Only"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Terms & Conditions</Label>
            <Textarea
              id="description"
              placeholder="Describe the rules, win conditions, and proof required..."
              className="min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Wager Amount ($)</Label>
            <div className="relative">
              <Coins className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="1"
                placeholder="0.00"
                className="pl-9"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              Available Balance: ${user?.balance?.toFixed(2) ?? "0.00"}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || isDisabled} className="px-8">
              {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              {isDisabled ? "Please log in first" : "Post Challenge"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}