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

export default function CreateContractModal({ onContractCreated, isDisabled }: { onContractCreated: (newContract: any) => void, isDisabled: boolean }) {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // In a real app, you would send this to your API
    const newContract = {
      id: Math.random().toString(36).substr(2, 9), // Temporary ID
      maker: user,
      taker: null,
      winner: "",
      title,
      description,
      amount: parseFloat(amount),
      status: "open",
      created_at: new Date().toISOString(),
    };

    // Simulate API delay
    setTimeout(() => {
      onContractCreated(newContract);
      setLoading(false);
      setOpen(false);
      // Reset form
      setTitle("");
      setDescription("");
      setAmount("");
    }, 800);
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